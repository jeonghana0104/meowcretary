import React, { useState } from "react";
// 이미지 경로가 맞는지 확인해 주세요.
import CatLogo from "../../assets/비서냥이.png"; 
import { useNavigate } from "react-router-dom";

// --- 데이터 정의 ---
const KEYWORDS = [
  { id: 1, name: "다자녀장학금" },
  { id: 2, name: "스마트융합공학부" },
  { id: 3, name: "가을축제" },
  { id: 4, name: "기숙사" },
  { id: 5, name: "봉사활동" },
];

const DATA = [
  { id: 101, keywordId: 1, title: "[공지] 2025학년도 2학기 다자녀장학금 신청 안내", date: "2025-10-20", source: "한양인" },
  { id: 102, keywordId: 1, title: "추가 서류 제출 기한 안내", date: "2025-10-19", source: "LMS" },
  { id: 201, keywordId: 2, title: "캡스톤 디자인 중간발표 공지", date: "2025-10-18", source: "학과" },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKeyword, setSelectedKeyword] = useState(KEYWORDS[0].id);
  const filteredData = DATA.filter(item => item.keywordId === selectedKeyword);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* 핸드폰 프레임 */}
      <div 
        className="w-[390px] h-[800px] bg-white border-[14px] border-black rounded-[45px] shadow-2xl flex flex-col overflow-hidden relative"
        style={{
            width: '390px',
            height: '800px',
            backgroundColor: 'white',
            border: '14px solid black',
            borderRadius: '45px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }}
      >
        
        {/* 상단 여백 */}
        <div className="w-full h-6 bg-white shrink-0" style={{ height: '24px', flexShrink: 0 }}></div>

        {/* 헤더 */}
        <header className="w-full px-5 pb-4 flex flex-col items-center border-b border-gray-100 shrink-0" style={{ padding: '0 20px 16px', borderBottom: '1px solid #f3f4f6' }}>
          {/* 로고 */}
          <div className="flex items-center mb-4" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <img
              src={CatLogo}
              alt="Logo"
              className="w-5 h-5 mr-1.5 object-contain"
              style={{ width: '20px', height: '20px', marginRight: '6px', objectFit: 'contain' }}
            />
            <span className="text-lg font-bold text-gray-800" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>비서냥이</span>
          </div>

          {/* 페이지 타이틀 바 */}
          <div className="w-full bg-gray-100 py-3 px-4 rounded-lg flex items-center justify-between relative" style={{ width: '100%', backgroundColor: '#f3f4f6', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* 뒤로가기 버튼 */}
            <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4b5563' }}>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <span className="text-base font-bold text-gray-800" style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
              정보 대시보드
            </span>
            
            {/* 우측 햄버거 아이콘 (장식용) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-6 h-6 text-gray-800"
              style={{ width: '24px', height: '24px', color: '#1f2937' }}
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>
        </header>

        {/* 메인 컨텐츠 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          
          {/* 키워드 필터 (가로 스크롤) */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4" style={{ overflowX: 'auto', paddingBottom: '10px', display: 'flex', gap: '8px' }}>
            {KEYWORDS.map((k) => (
              <button
                key={k.id}
                onClick={() => setSelectedKeyword(k.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                  selectedKeyword === k.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    border: selectedKeyword === k.id ? '1px solid #9333ea' : '1px solid #e5e7eb',
                    backgroundColor: selectedKeyword === k.id ? '#9333ea' : 'white',
                    color: selectedKeyword === k.id ? 'white' : '#4b5563',
                    cursor: 'pointer'
                }}
              >
                {k.name}
              </button>
            ))}
          </div>

          {/* 정보 리스트 */}
          <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                  <div className="flex justify-between items-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded" style={{ fontSize: '12px', fontWeight: 'bold', color: '#9333ea', backgroundColor: '#f3e8ff', padding: '4px 8px', borderRadius: '4px' }}>{item.source}</span>
                    <span className="text-xs text-gray-400" style={{ fontSize: '12px', color: '#9ca3af' }}>{item.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-800 mb-1 leading-tight" style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px', lineHeight: '1.25' }}>{item.title}</h4>
                  <p className="text-xs text-gray-500" style={{ fontSize: '12px', color: '#6b7280' }}>터치하여 자세히 보기</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed" style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                수집된 정보가 없습니다.
              </div>
            )}
          </div>

        </div>

        {/* 하단 홈 바 */}
        <div className="w-full h-8 bg-white flex justify-center items-start pt-1 shrink-0" style={{ width: '100%', height: '32px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', flexShrink: 0 }}>
          <div className="w-32 h-1.5 bg-gray-300 rounded-full" style={{ width: '128px', height: '6px', backgroundColor: '#d1d5db', borderRadius: '9999px' }}></div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;