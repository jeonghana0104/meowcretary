from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
from bs4 import BeautifulSoup
import os

# 🌟 [수정 완료] 구형 서비스 계정 대신 데스크톱 앱(OAuth 2.0)용 라이브러리 임포트
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# classifier.py에서 분류 함수 가져오기
from classifier import classify_notice 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🌟 구글 캘린더 설정 완료
GOOGLE_CALENDAR_ID = "choyein466@gmail.com" # 조에인 님의 진짜 구글 달력 ID
GOOGLE_CREDS_FILE = "credentials.json"       # 구글 콘솔에서 다운받은 데스크톱 키 파일
TOKEN_FILE = "token.json"                   # 로그인 성공 시 인증 정보가 자동 저장될 파일
SCOPES = ['https://www.googleapis.com/auth/calendar']

class NoticeSyncRequest(BaseModel):
    title: str
    category: str
    date: str
    link: str
    deadline: Optional[str] = None

def get_calendar_service():
    """🌟 [새로 추가] 데스크톱 앱 키를 읽어서 실제 로그인창을 띄우는 핵심 인증 함수"""
    creds = None
    # 이전에 로그인한 기록(token.json)이 있다면 가져오기
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    # 기록이 없거나 만료되었다면 새로 구글 로그인창 띄우기
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(GOOGLE_CREDS_FILE, SCOPES)
            # 로컬 컴퓨터 브라우저에 구글 로그인 창을 실행합니다
            creds = flow.run_local_server(port=0)
        
        # 로그인이 완료되면 다음에는 창이 안 뜨도록 token.json으로 저장
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
            
    return build('calendar', 'v3', credentials=creds)

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

# 🚀 외부 앱 백엔드 연동 API 엔드포인트!
@app.post("/api/sync-apps")
def sync_to_external_apps(notices: List[NoticeSyncRequest]):
    try:
        # 🌟 [수정 완료] 새로 만든 우회형 OAuth 서비스 호출
        calendar_service = get_calendar_service()
        
        sync_results = {
            "google_calendar": [],
            "notepad": []
        }
        
        for notice in notices:
            if notice.deadline:
                calendar_event = {
                    'summary': f"[{notice.category}] {notice.title}",
                    'description': f"비서냥이 자동 등록 일정\n원본 링크: {notice.link}",
                    'start': {
                        'date': notice.deadline,
                        'timeZone': 'Asia/Seoul',
                    },
                    'end': {
                        'date': notice.deadline,
                        'timeZone': 'Asia/Seoul',
                    }
                }
                
                calendar_service.events().insert(calendarId=GOOGLE_CALENDAR_ID, body=calendar_event).execute()
                print(f"[📅 구글 캘린더 등록 완료]: {calendar_event['summary']} -> 날짜: {notice.deadline}")
                
                sync_results["google_calendar"].append(notice.title)
            else:
                print(f"[📅 구글 캘린더 패스] 마감 날짜 없음: {notice.title}")
            
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
        print(f"❌ 구글 연동 오류 원인: {str(e)}")
        raise HTTPException(status_code=500, detail=f"구글 캘린더 연동 실패: {str(e)}")