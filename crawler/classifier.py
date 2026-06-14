import re
from datetime import datetime

def classify_notice(title):
    """
    공지사항 제목을 분석하여 카테고리, 실제 마감일, 디데이(D-Day)를 자동으로 분류합니다.
    """
    today = datetime.today().date()
    
    # ── 1단계: 카테고리 키워드 분류 ──
    category = "일반"
    keyword_map = {
        "장학": ["장학", "장학금", "국가장학", "재단", "지급"],
        "취업/채용": ["채용", "인턴", "인턴십", "취업", "모집", "일자리"],
        "공모전": ["공모전", "대회", "경진대회", "해커톤", "프로그램"],
        "학사": ["학사", "성적", "기말고사", "중간고사", "수강신청", "졸업", "학부", "시험"]
    }
    
    for cat, keywords in keyword_map.items():
        if any(kw in title for kw in keywords):
            category = cat
            break

    # ── 2단계: 제목에서 마감일 날짜 패턴 추출 (~6/25, ~2026.06.25 등) ──
    deadline = None
    dday = None
    
    # 정규식 패턴 설정
    full_date_pattern = r"(\d{4})[-\./](\d{1,2})[-\./](\d{1,2})" # YYYY.MM.DD
    short_date_pattern = r"(\d{1,2})[-\./](\d{1,2})"             # MM/DD 또는 MM.DD
    
    full_match = re.search(full_date_pattern, title)
    if full_match:
        year, month, day = map(int, full_match.groups())
        try:
            deadline_date = datetime(year, month, day).date()
            deadline = f"{year}-{month:02d}-{day:02d}"
            dday = (deadline_date - today).days
        except ValueError:
            pass
            
    if not deadline:
        short_match = re.search(short_date_pattern, title)
        if short_match:
            month, day = map(int, short_match.groups())
            if 1 <= month <= 12 and 1 <= day <= 31:
                current_year = today.year
                try:
                    deadline_date = datetime(current_year, month, day).date()
                    # 만약 추출된 날짜가 이미 지나간 과거라면 내년 연도로 처리하는 예외 방어코드
                    if (deadline_date - today).days < -180:
                        deadline_date = datetime(current_year + 1, month, day).date()
                    
                    deadline = f"{deadline_date.year}-{month:02d}-{day:02d}"
                    dday = (deadline_date - today).days
                except ValueError:
                    pass

    return {
        "category": category,
        "deadline": deadline,
        "dday": dday
    }