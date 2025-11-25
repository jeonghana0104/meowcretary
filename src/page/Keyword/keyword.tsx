import React from "react";
import CatLogo from "../../assets/비서냥이.png";
import { useNavigate } from "react-router-dom";

const Keyword: React.FC = () => {
  const navigate = useNavigate();

  const keywords = [
    "다자녀장학금",
    "스마트융합공학부",
    "가을축제",
    "기숙사",
    "봉사활동",
    "키워드",
  ];

  return (
    // 전체 배경
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
        <div className="w-full h-6 bg-white shrink-0" style={{ height: '24px', flexShrink: 0, backgroundColor: 'white' }} />

        {/* 헤더 */}
        <header className="px-4 flex flex-col items-center border-b border-gray-200 shrink-0" style={{ padding: '0 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            {/* 로고 */}
            <div className="flex items-center gap-2 mb-2 mt-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: '8px' }}>
            <img
                src={CatLogo}
                className="object-contain"
                style={{ width: "20px", height: "20px", marginRight: "10px", objectFit: 'contain' }}
            />
            <span className="text-lg font-semibold" style={{ fontSize: '18px', fontWeight: '600' }}>비서냥이</span>
            </div>

            {/* 메뉴 + 키워드 설정 */}
            <div
            className="w-full bg-gray-100 flex items-center py-2 mb-2 rounded"
            style={{ width: '100%', backgroundColor: '#f3f4f6', padding: '8px 6px', marginBottom: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            >
            <button className="p-0 m-0 mr-2" onClick={() => navigate("/menu")} style={{ padding: 0, margin: 0, marginRight: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ display: "block", width: '13px', height: '13px' }}
                >
                <path d="M3 6H21" />
                <path d="M3 12H21" />
                <path d="M3 18H21" />
                </svg>
            </button>
            <span className="text-lg font-semibold" style={{ fontSize: '18px', fontWeight: '600' }}>키워드 설정</span>
            </div>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 px-5 py-4 overflow-y-auto scrollbar-hide" style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
            {/* 검색창 */}
            <div className="relative mb-5" style={{ position: 'relative', marginBottom: '20px' }}>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="gray"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.7, width: '14px', height: '14px' }}
                    >
                    <circle cx="6" cy="6" r="4" />
                    <path d="M10 10L13 13" />
                    </svg>
                </div>
                <input
                    placeholder="검색"
                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#B783FF] focus:outline-none text-gray-700"
                    style={{ width: '100%', paddingLeft: '36px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* 리스트 */}
            <div className="border-t border-gray-300" style={{ borderTop: '1px solid #d1d5db' }}>
                {keywords.map((item, idx) => (
                    <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-gray-300"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #d1d5db' }}
                    >
                    <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="w-5 h-[2px] bg-red-500" style={{ width: '20px', height: '2px', backgroundColor: '#ef4444' }}></div>
                        <span className="text-gray-800" style={{ color: '#1f2937' }}>{item}</span>
                    </div>

                    <button className="p-1" style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        stroke="red"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{ width: '18px', height: '18px', stroke: 'red' }}
                        >
                        <path d="M18 6L6 18" />
                        <path d="M6 6L18 18" />
                        </svg>
                    </button>
                    </div>
                ))}

                {/* 추가 */}
                <div className="flex items-center gap-3 py-3 border-b border-gray-300" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #d1d5db' }}>
                    <svg
                    width="20"
                    height="20"
                    stroke="#4A56E2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ width: '20px', height: '20px', stroke: '#4A56E2' }}
                    >
                    <path d="M10 4V16" />
                    <path d="M4 10H16" />
                    </svg>
                    <span className="text-gray-900" style={{ color: '#111827' }}>키워드 추가하기</span>
                </div>
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

export default Keyword;
