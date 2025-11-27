import React, { useState } from "react";
import CatLogo from "../../assets/비서냥이.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

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
  const { theme } = useTheme();
  const [selectedKeyword, setSelectedKeyword] = useState(KEYWORDS[0].id);
  const filteredData = DATA.filter(item => item.keywordId === selectedKeyword);

  // 테마 스타일 정의
  const isLight = theme === "light";
  const bgStyle = isLight ? "white" : "#111827";
  const textStyle = isLight ? "#1f2937" : "white";
  const borderStyle = isLight ? "#e5e7eb" : "#374151";
  const headerBarColor = isLight ? "#2E63A6" : "#374151";
  const cardBgStyle = isLight ? "white" : "#1f2937";
  const cardTextStyle = isLight ? "#1f2937" : "#e5e7eb";

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="w-[390px] h-[800px] border-[14px] border-black rounded-[45px] shadow-2xl flex flex-col overflow-hidden relative transition-colors duration-300"
        style={{ width: '390px', height: '800px', backgroundColor: bgStyle, color: textStyle, border: '14px solid black', borderRadius: '45px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        
        <div className="w-full h-6 shrink-0 transition-colors duration-300" style={{ height: '24px', flexShrink: 0, backgroundColor: bgStyle }} />

        <header className="px-4 flex flex-col items-center border-b shrink-0" style={{ padding: '0 16px', borderBottom: `1px solid ${borderStyle}`, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div className="flex items-center gap-2 mb-2 mt-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: '8px' }}>
            <img src={CatLogo} className="object-contain" style={{ width: "50px", height: "50px", marginRight: "10px", objectFit: 'contain' }} />
            <span className="text-lg font-semibold" style={{ fontSize: '18px', fontWeight: '600' }}>비서냥이</span>
            </div>

            <div className="w-full mb-2 rounded" style={{ width: "100%", backgroundColor: headerBarColor, padding: "10px 6px", marginBottom: "8px", borderRadius: "4px", position: "relative", textAlign: "center" }}>
            <button onClick={() => navigate("/menu")} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 6H21" /><path d="M3 12H21" /><path d="M3 18H21" /></svg>
            </button>
            <span style={{ fontSize: "18px", fontWeight: 600, color: "white" }}>정보 대시보드</span>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4" style={{ overflowX: 'auto', paddingBottom: '10px', display: 'flex', gap: '8px' }}>
            {KEYWORDS.map((k) => (
              <button key={k.id} onClick={() => setSelectedKeyword(k.id)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border"
                style={{ padding: '8px 16px', borderRadius: '9999px', fontSize: '14px', whiteSpace: 'nowrap', 
                    border: selectedKeyword === k.id ? '1px solid #9333ea' : `1px solid ${borderStyle}`,
                    backgroundColor: selectedKeyword === k.id ? '#9333ea' : cardBgStyle,
                    color: selectedKeyword === k.id ? 'white' : textStyle, cursor: 'pointer' }}>
                {k.name}
              </button>
            ))}
          </div>

          <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: cardBgStyle, padding: '16px', borderRadius: '12px', border: `1px solid ${borderStyle}` }}>
                  <div className="flex justify-between items-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="text-xs font-bold bg-purple-50 px-2 py-1 rounded" style={{ fontSize: '12px', fontWeight: 'bold', color: '#9333ea', backgroundColor: isLight ? '#f3e8ff' : '#374151', padding: '4px 8px', borderRadius: '4px' }}>{item.source}</span>
                    <span className="text-xs text-gray-400" style={{ fontSize: '12px', color: '#9ca3af' }}>{item.date}</span>
                  </div>
                  <h4 className="text-base font-bold mb-1 leading-tight" style={{ fontSize: '16px', fontWeight: 'bold', color: cardTextStyle, marginBottom: '4px', lineHeight: '1.25' }}>{item.title}</h4>
                  <p className="text-xs text-gray-500" style={{ fontSize: '12px', color: '#6b7280' }}>터치하여 자세히 보기</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed" style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', backgroundColor: isLight ? '#f9fafb' : '#374151', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                수집된 정보가 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-8 bg-white flex justify-center items-start pt-1 shrink-0" style={{ width: '100%', height: '32px', backgroundColor: bgStyle, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', flexShrink: 0 }}>
          <div className="w-32 h-1.5 bg-gray-300 rounded-full" style={{ width: '128px', height: '6px', backgroundColor: isLight ? '#d1d5db' : '#4b5563', borderRadius: '9999px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
