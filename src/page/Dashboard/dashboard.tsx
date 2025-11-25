import React, { useState } from 'react';

// --- 1. 타입 정의 (여기서 바로 정의) ---
type KeywordItem = {
  id: number;
  name: string;
};

type CrawledDataItem = {
  id: number;
  keywordId: number;
  title: string;
  summary: string;
  date: string;
  source: string;
};

// --- 2. 데이터 직접 입력 (import 안 함!) ---
const KEYWORDS: KeywordItem[] = [
  { id: 1, name: '다자녀장학금' },
  { id: 2, name: '스마트융합공학부' },
  { id: 3, name: '가을축제' },
  { id: 4, name: '기숙사' },
  { id: 5, name: '봉사활동' },
];

const CRAWLED_DATA: CrawledDataItem[] = [
  {
    id: 101,
    keywordId: 1,
    title: '[공지] 2025학년도 2학기 다자녀장학금 신청 안내',
    summary: '신청일: 10/30 ~ 11/15. 지원 자격: 대한민국 국적을 소지한...',
    date: '2025-10-20',
    source: '한양인 포털',
  },
  {
    id: 102,
    keywordId: 1,
    title: '다자녀장학금 추가 서류 제출 기한',
    summary: '1차 서류 미비자 대상 추가 제출 기한 ~11/17까지',
    date: '2025-10-19',
    source: 'LMS 공지',
  },
  {
    id: 201,
    keywordId: 2,
    title: '스마트융합공학부 캡스톤 디자인 중간발표',
    summary: '중간발표 일시: 11월 5일 (수) 14:00',
    date: '2025-10-18',
    source: '학과 공지',
  },
];

// --- 3. 화면 컴포넌트 ---
const Dashboard: React.FC = () => {
  const [selectedKeywordId, setSelectedKeywordId] = useState<number>(KEYWORDS[0].id);

  const filteredData = CRAWLED_DATA.filter(
    (item) => item.keywordId === selectedKeywordId
  );

  return (
    <div className="w-full p-4 pb-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">정보 대시보드</h2>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 ml-1">나의 키워드</h3>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {KEYWORDS.map((keyword) => (
            <button
              key={keyword.id}
              onClick={() => setSelectedKeywordId(keyword.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                selectedKeywordId === keyword.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {keyword.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-3">
          <h3 className="text-lg font-bold text-gray-800">
            수집된 정보 <span className="text-purple-600 ml-1">{filteredData.length}</span>건
          </h3>
          <span className="text-xs text-gray-400">최근 업데이트: 오늘 09:00</span>
        </div>
        
        <div className="space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                    {item.source}
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2 leading-snug">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.summary}
                </p>
                <div className="flex gap-2 border-t border-gray-50 pt-3">
                  <button className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
                    캘린더 담기
                  </button>
                  <button className="flex-1 py-2 text-sm font-semibold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100">
                    메모장 저장
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              수집된 정보가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;