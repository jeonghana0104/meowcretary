from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
from bs4 import BeautifulSoup

# 🌟 구글 캘린더 API 연동을 위한 라이브러리 임포트
from google.oauth2 import service_account
from googleapiclient.discovery import build

# 방금 만든 classifier.py에서 분류 함수 가져오기!
from classifier import classify_notice 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🌟 구글 캘린더 연동 설정
# 2단계에서 확인한 조에인 님의 캘린더 ID를 여기에 적어주세요! (기본은 개인 구글 이메일 주소 형태일 확률이 높습니다.)
GOOGLE_CALENDAR_ID = "choyein466@gmail.com" 
GOOGLE_CREDS_FILE = "credentials.json" # 1단계에서 다운받아 폴더에 넣은 키 파일명
SCOPES = ['https://www.googleapis.com/auth/calendar']

# 리액트 프론트엔드에서 보내줄 연동 데이터 규칙(Schema) 정의
class NoticeSyncRequest(BaseModel):
    title: str
    category: str
    date: str
    link: str
    deadline: Optional[str] = None

@app.get("/")
def home():
    return {"message": "비서냥이 한양대 메인 공지 실시간 감지 서버 가동 중! 🐾"}

@app.get("/api/hanyang-notice")
def get_hanyang_notice():
    url = "https://www.hanyang.ac.kr/web/www/notice_all"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers, verify=False)
        soup = BeautifulSoup(response.text, "html.parser")
        rows = soup.select("div.hyu-list-body-item")
        
        real_notice_list = []
        filtered_count = 1
        TARGET_KEYWORD = "모집" 
        
        for row in rows:
            title_element = row.select_one("h4 a")
            if title_element:
                title = title_element.get_text().strip()
                if TARGET_KEYWORD in title:
                    link = title_element.get("href", "")
                    if link and not link.startswith("http"):
                        link = "https://www.hanyang.ac.kr" + link
                    
                    analysis = classify_notice(title)
                        
                    real_notice_list.append({
                        "id": filtered_count,
                        "title": title,
                        "date": "2026-06-14", 
                        "link": link,
                        "category": analysis["category"],
                        "deadline": analysis["deadline"],
                        "dday": analysis["dday"]
                    })
                    filtered_count += 1
                    
        if not real_notice_list:
            for index, row in enumerate(rows[:3]):
                title_element = row.select_one("h4 a")
                if title_element:
                    title = title_element.get_text().strip()
                    link = title_element.get("href", "")
                    if link and not link.startswith("http"):
                        link = "https://www.hanyang.ac.kr" + link
                    
                    analysis = classify_notice(title)
                    
                    real_notice_list.append({
                        "id": index + 1,
                        "title": f"💡 [최신공지] {title}",
                        "date": "2026-06-14",
                        "link": link,
                        "category": analysis["category"],
                        "deadline": analysis["deadline"],
                        "dday": analysis["dday"]
                    })

        return {"success": True, "count": len(real_notice_list), "data": real_notice_list}
        
    except Exception as e:
        return {"success": False, "error": f"한양대 메인 크롤링 실패: {str(e)}"}


# 🚀 [진짜 구글 캘린더 연결 완료] 외부 앱 백엔드 연동 API 엔드포인트!
@app.post("/api/sync-apps")
def sync_to_external_apps(notices: List[NoticeSyncRequest]):
    try:
        # 구글 캘린더 인증 서비스 빌드
        creds = service_account.Credentials.from_service_account_file(GOOGLE_CREDS_FILE, scopes=SCOPES)
        calendar_service = build('calendar', 'v3', credentials=creds)
        
        sync_results = {
            "google_calendar": [],
            "notepad": []
        }
        
        for notice in notices:
            # ── [1] 실제 구글 캘린더 서버에 일정 등록 ──
            if notice.deadline:
                # 구글 캘린더가 요구하는 API 전송 규격 포맷 생성
                calendar_event = {
                    'summary': f"[{notice.category}] {notice.title}",
                    'description': f"비서냥이 자동 등록 일정\n원본 링크: {notice.link}",
                    'start': {
                        'date': notice.deadline,  # YYYY-MM-DD 형식 그대로 적용
                        'timeZone': 'Asia/Seoul',
                    },
                    'end': {
                        'date': notice.deadline,  # 하루 종일 이벤트로 등록
                        'timeZone': 'Asia/Seoul',
                    }
                }
                
                # 🚀 실제 구글 서버 API 호출! 일정을 내 달력에 삽입(insert)합니다.
                calendar_service.events().insert(calendarId=GOOGLE_CALENDAR_ID, body=calendar_event).execute()
                print(f"[📅 구글 캘린더 등록 완료]: {calendar_event['summary']} -> 날짜: {notice.deadline}")
                
                sync_results["google_calendar"].append(notice.title)
            else:
                print(f"[📅 구글 캘린더 패스] 마감 날짜 없음: {notice.title}")
            
            # ── [2] 서버 메모장 파일에 저장 ──
            memo_template = (
                f"==== 비서냥이 메모장 자동 저장 ====\n"
                f"📌 정보 분류: {notice.category}\n"
                f"📢 공지 제목: {notice.title}\n"
                f"📅 최초 등록: {notice.date}\n"
                f"⏱️ 마감 일정: {notice.deadline if notice.deadline else '정보 없음'}\n"
                f"🔗 원본 링크: {notice.link}\n"
                f"====================================\n\n"
            )
            
            with open("meowcretary_memo.txt", "a", encoding="utf-8") as f:
                f.write(memo_template)
                
            sync_results["notepad"].append(notice.title)

        return {
            "success": True, 
            "message": f"성공적으로 {len(notices)}건의 공지를 분류 연동했습니다. 🐾",
            "detail": sync_results
        }
        
    except Exception as e:
        # 혹시 키 파일이 없거나 아이디 오류가 나면 힌트 제공
        print(f"❌ 구글 연동 오류 원인: {str(e)}")
        raise HTTPException(status_code=500, detail=f"구글 캘린더 연동 실패. 캘린더 ID나 credentials.json 파일을 확인하세요: {str(e)}")