import React from "react";
import CatLogo from "../../assets/비서냥이.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Menu() {
  const navigate = useNavigate();
  const { theme } = useTheme(); // 🔥 테마 가져오기

  // 🔥 테마별 색상 정의
  const isLight = theme === "light";
  const bgStyle = isLight ? "white" : "#111827";
  const textStyle = isLight ? "#1f2937" : "white";
  const borderStyle = isLight ? "#e5e7eb" : "#374151";
  const headerBarColor = isLight ? "#2E63A6" : "#374151";

  return (
    // 배경색: Tailwind 클래스가 안 먹힐 수 있으므로 style도 병행
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

        {/* 상태바 */}
        <div
          className="w-full h-6 shrink-0"
          style={{ backgroundColor: bgStyle, height: "24px" }}
        />

        {/* ▼▼ 통일된 헤더 ▼▼ */}
        <header
          className="px-4 flex flex-col items-center border-b shrink-0"
          style={{
            padding: "0 16px",
            borderBottom: `1px solid ${borderStyle}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 로고 + 텍스트 */}
          <div
            className="flex items-center gap-2 mt-2 mb-2"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <img
              src={CatLogo}
              className="object-contain"
              style={{
                width: "50px",
                height: "50px",
                marginRight: "10px",
                objectFit: "contain",
              }}
            />
            <span
              className="text-lg font-semibold"
              style={{ fontSize: "18px", fontWeight: "600", color: textStyle }}
            >
              비서냥이
            </span>
          </div>

          {/* 파란 헤더바 */}
          <div
            style={{
              width: "100%",
              backgroundColor: headerBarColor,
              padding: "10px 6px",
              borderRadius: "4px",
              position: "relative",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            {/* 메뉴 아이콘 */}
            <button
              onClick={() => navigate("/menu")}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 6H21" />
                <path d="M3 12H21" />
                <path d="M3 18H21" />
              </svg>
            </button>

            <span
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "white",
              }}
            >
              메뉴
            </span>
          </div>
        </header>


        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ flex: 1, overflowY: 'auto' }}>
          {/* 유저 정보 */}
          <div className="px-6 py-5 border-b border-gray-100" style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
            <div className="flex justify-between items-center w-full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span className="text-lg font-semibold text-gray-800" style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                정하나 님 &gt;
              </span>
              <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="border border-gray-300 rounded-full px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50" onClick={() => navigate("/login")} style={{ border: '1px solid #d1d5db', borderRadius: '9999px', padding: '4px 12px', fontSize: '12px', color: '#4b5563', backgroundColor: 'white' }}>
                  로그아웃
                </button>
                {/* 톱니바퀴 아이콘 - 크기 강제 고정 */}
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
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* 메뉴 리스트 */}
          <div className="px-6 py-10 space-y-6 text-center" style={{ padding: '100px 24px', textAlign: 'center' }}>
            <p className="text-lg font-medium text-gray-700 cursor-pointer hover:text-black mb-6" onClick={() => navigate("/keyword")} style={{ fontSize: '18px', fontWeight: '500', color: '#374151', marginBottom: '80px', cursor: 'pointer' }}>키워드 설정</p>
            <p className="text-lg font-medium text-gray-700 cursor-pointer hover:text-black mb-6" onClick={() => navigate("/dashboard")} style={{ fontSize: '18px', fontWeight: '500', color: '#374151', marginBottom: '80px', cursor: 'pointer' }}>정보 대시보드</p>
            <p className="text-lg font-medium text-gray-700 cursor-pointer hover:text-black" onClick={() => navigate("/member")} style={{ fontSize: '18px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>회원정보 설정</p>
          </div>
        </div>

        {/* 하단 홈 바 */}
        <div className="w-full h-8 bg-white flex justify-center items-start pt-1 shrink-0" style={{ width: '100%', height: '32px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', flexShrink: 0 }}>
          <div className="w-32 h-1.5 bg-gray-300 rounded-full" style={{ width: '128px', height: '6px', backgroundColor: '#d1d5db', borderRadius: '9999px' }}></div>
        </div>

      </div>
    </div>
  );
}
