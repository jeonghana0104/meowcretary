import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';


// --- 데이터 ---
const KEYWORDS = [
  { id: 1, name: '다자녀장학금' },
  { id: 2, name: '스마트융합공학부' },
  { id: 3, name: '가을축제' },
  { id: 4, name: '기숙사' },
];

const DATA = [
  { id: 101, keywordId: 1, title: '[공지] 2025학년도 2학기 다자녀장학금 신청 안내', date: '2025-10-20', source: '한양인' },
  { id: 102, keywordId: 1, title: '추가 서류 제출 기한 안내', date: '2025-10-19', source: 'LMS' },
  { id: 201, keywordId: 2, title: '캡스톤 디자인 중간발표 공지', date: '2025-10-18', source: '학과' },
];

const Dashboard: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState(KEYWORDS[0].id);
  const filteredData = DATA.filter(item => item.keywordId === selectedKeyword);

  return (
    <MobileLayout title="정보 대시보드">
      <div className="px-4 py-4">
        
        {/* 키워드 필터 (가로 스크롤) */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
          {KEYWORDS.map((k) => (
            <button
              key={k.id}
              onClick={() => setSelectedKeyword(k.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedKeyword === k.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {k.name}
            </button>
          ))}
        </div>

        {/* 정보 리스트 */}
        <div className="space-y-3">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">{item.source}</span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <h4 className="text-base font-bold text-gray-800 mb-1 leading-tight">{item.title}</h4>
                <p className="text-xs text-gray-500">터치하여 자세히 보기</p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
              수집된 정보가 없습니다.
            </div>
          )}
        </div>

      </div>
    </MobileLayout>
  );
};

export default Dashboard;