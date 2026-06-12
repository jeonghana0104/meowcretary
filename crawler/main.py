from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "비서냥이 한양대 메인 공지 실시간 감지 서버 가동 중! 🐾"}

@app.get("/api/hanyang-notice")
def get_hanyang_notice():
    # 🌟 예인이가 방금 크롬으로 뜯어본 진짜 한양대 전체 공지사항 주소!
    url = "https://www.hanyang.ac.kr/web/www/notice_all"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        # 1. 한양대 공지사항 HTML 실시간으로 긁어오기
        response = requests.get(url, headers=headers, verify=False)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # 2. 🌟 [위치 데이터 1] 예인이가 찾은 공지사항 한 줄(div.hyu-list-body-item) 다 가져오기!
        rows = soup.select("div.hyu-list-body-item")
        
        real_notice_list = []
        filtered_count = 1
        
        # 🌟 예인이가 실시간으로 감지하고 싶은 키워드!
        # 지금 당장 화면에 글이 올라오는 걸 확인해보고 싶다면 "모집"이나 "안내"로 적어봐!
        # 나중에 졸작 발표할 때는 원래 하려던 "장학"이나 "창업"으로 바꾸면 돼.
        TARGET_KEYWORD = "모집" 
        
        for row in rows:
            # 3. 🌟 [위치 데이터 2] 그 한 줄 안에서 제목과 링크가 든 h4 밑의 a 태그 콕 집기!
            title_element = row.select_one("h4 a")
            
            if title_element:
                title = title_element.get_text().strip()
                
                # 💡 [핵심 단어 감지] 제목에 예인이가 지정한 키워드가 들어있는지 검사!
                if TARGET_KEYWORD in title:
                    link = title_element.get("href", "")
                    if link and not link.startswith("http"):
                        link = "https://www.hanyang.ac.kr" + link
                        
                    real_notice_list.append({
                        "id": filtered_count,
                        "title": title,
                        "date": "오늘", # 메인 공지는 날짜 태그가 따로 숨어있어서 우선 오늘로 표기!
                        "link": link
                    })
                    filtered_count += 1
                    
        # 만약 필터링된 키워드 글이 하나도 없으면 메인 공지 최신글 3개 그냥 강제로 보여주기
        if not real_notice_list:
            for index, row in enumerate(rows[:3]):
                title_element = row.select_one("h4 a")
                if title_element:
                    title = title_element.get_text().strip()
                    link = title_element.get("href", "")
                    if link and not link.startswith("http"):
                        link = "https://www.hanyang.ac.kr" + link
                    
                    real_notice_list.append({
                        "id": index + 1,
                        "title": f"💡 [최신공지] {title}",
                        "date": "오늘",
                        "link": link
                    })

        return {"success": True, "count": len(real_notice_list), "data": real_notice_list}
        
    except Exception as e:
        return {"success": False, "error": f"한양대 메인 크롤링 실패: {str(e)}"}