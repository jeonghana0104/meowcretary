// 🌟 기존에 있던 import 구문들이나 기존 코드들은 절대 건드리지 말고 그대로 둬!
// 파일 맨 밑에 아래 코드를 추가해 줘.

import axios from 'axios'; // 만약 맨 위에 이미 axios가 import 되어 있다면 이 줄은 빼도 돼!

// 한양대 공지사항 데이터를 받아오는 함수 export 하기
export const getHanyangNotice = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/hanyang-notice');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("공지사항 가져오기 실패ㅠ:", error);
    return { success: false, count: 0, data: [] };
  }
};

// 🌟 [2단계 추가] 선택한 공지사항 데이터를 백엔드로 전송하는 함수 추가
export const syncExternalApps = async (selectedNotices: any[]) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/sync-apps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedNotices), // 선택된 공지 데이터를 JSON 문자열로 변환하여 전송
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("외부앱 연동 전송 실패ㅠ:", error);
    return { success: false, message: "통신 실패", detail: { google_calendar: [], notepad: [] } };
  }
};

export const getUserKeywords = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/keywords");
    return response.data;
  } catch (error) {
    console.error("키워드 목록 호출 실패:", error);
    // 🌟 서버가 꺼져있어도 프론트 시연이 멈추지 않게 기본 키워드를 반환해주는 안전장치
    return {
      success: true,
      data: ['장학금', '공모전', '인턴십', '기말고사', 'SW학부', '채용', '도서관']
    };
  }
};
