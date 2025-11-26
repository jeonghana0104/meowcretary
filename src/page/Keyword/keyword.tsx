import React, { useState } from "react";
import CatLogo from "../../assets/비서냥이.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext"; // 전역 테마 사용

const Keyword: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // 전역 테마

  const [keywords, setKeywords] = useState([
    "다자녀장학금",
    "스마트융합공학부",
    "가을축제",
    "기숙사",
    "봉사활동",
    "키워드",
  ]);
  const [filtered, setFiltered] = useState(keywords);
const [search, setSearch] = useState("");

const handleSearch = () => {
  if (search.trim() === "") {
    setFiltered(keywords);
  } else {
    setFiltered(
      keywords.filter((k) =>
        k.toLowerCase().includes(search.toLowerCase())
      )
    );
  }
};
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const openDeleteModal = (keyword: string) => setDeleteTarget(keyword);
  const closeModal = () => setDeleteTarget(null);
  const deleteKeyword = () => {
    if (!deleteTarget) return;
    setKeywords((prev) => prev.filter((k) => k !== deleteTarget));
    setFiltered((prev) => prev.filter((k) => k !== deleteTarget));
    setDeleteTarget(null);
  };

  // 테마 스타일
  const isLight = theme === "light";
  const bgStyle = isLight ? 'white' : '#111827';
  const textStyle = isLight ? '#1f2937' : 'white';
  const borderStyle = isLight ? '#e5e7eb' : '#374151';
  const inputBgStyle = isLight ? 'white' : '#1f2937';

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <div 
        className={`w-[390px] h-[800px] border-[14px] border-black rounded-[45px] shadow-2xl flex flex-col overflow-hidden relative transition-colors duration-300`}
        style={{
            width: '390px',
            height: '800px',
            backgroundColor: bgStyle,
            color: textStyle,
            border: '14px solid black',
            borderRadius: '45px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.3s, color 0.3s'
        }}
      >
        <div className="w-full h-6 shrink-0 transition-colors duration-300" style={{ height: '24px', flexShrink: 0, backgroundColor: bgStyle }} />

        <header className="px-4 flex flex-col items-center border-b shrink-0" style={{ padding: '0 16px', borderBottom: `1px solid ${borderStyle}`, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div className="flex items-center gap-2 mb-2 mt-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: '8px' }}>
            <img src={CatLogo} className="object-contain" style={{ width: "20px", height: "20px", marginRight: "10px", objectFit: 'contain' }} />
            <span className="text-lg font-semibold" style={{ fontSize: '18px', fontWeight: '600' }}>비서냥이</span>
            </div>

            <div className="w-full flex items-center py-2 mb-2 rounded" style={{ width: '100%', backgroundColor: isLight ? '#2E63A6' : '#374151', padding: '8px 6px', marginBottom: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
            <button className="p-0 m-0 mr-2" onClick={() => navigate("/menu")} style={{ padding: 0, margin: 0, marginRight: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: "block", width: '13px', height: '13px', color: textStyle }}>
                <path d="M3 6H21" />
                <path d="M3 12H21" />
                <path d="M3 18H21" />
                </svg>
            </button>
            <span className="text-lg font-semibold" style={{ textAlign: 'center', fontSize: '18px', fontWeight: '600' }}>키워드 설정</span>
            </div>
        </header>

        <div className="flex-1 px-5 py-4 overflow-y-auto scrollbar-hide" style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
            {/* 검색창 (크기 조절: 90% 정도, 오른쪽 마진 자동) */}
            <div className="relative mb-5" style={{ position: 'relative', marginBottom: '20px', width: '90%', marginRight: 'auto' }}>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="14" height="14" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, width: '14px', height: '14px' }}>
                    <circle cx="6" cy="6" r="4" />
                    <path d="M10 10L13 13" />
                    </svg>
                </div>
                <input
  placeholder="검색"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  className="w-full pl-9 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#2E63A6] focus:outline-none"
  style={{
    width: "100%",
    paddingLeft: "36px",
    paddingRight: "16px",
    paddingTop: "12px",
    paddingBottom: "12px",
    borderRadius: "8px",
    border: `1px solid ${borderStyle}`,
    fontSize: "15px",
    backgroundColor: inputBgStyle,
    color: textStyle,
  }}
/>
            </div>

            <div className="border-t" style={{ borderTop: `1px solid ${borderStyle}` }}>

            {filtered.map((item, idx) => (
    <div
      key={idx}
      className="relative py-3 border-b"
      style={{
        padding: "12px 0",
        borderBottom: `1px solid ${borderStyle}`,
        position: "relative",
      }}
    >
      {/* 삭제(X) 버튼 */}
      <button
        onClick={() => openDeleteModal(item)}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-1"
        style={{
          padding: "4px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          stroke="red"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ width: "18px", height: "18px", stroke: "red" }}
        >
          <path d="M18 6L6 18" />
          <path d="M6 6L18 18" />
        </svg>
      </button>

      {/* 텍스트 중앙 정렬 */}
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-full text-center"
        style={{ color: textStyle, fontSize: "15px" }}
      >
        {item}
      </span>
    </div>
  ))}
                

                <div className="flex items-center gap-3 py-3 border-b" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${borderStyle}` }}>
                    <svg width="20" height="20" stroke="#2E63A6" strokeWidth="2" strokeLinecap="round" style={{ width: '20px', height: '20px', stroke: '#2E63A6' }}>
                    <path d="M10 4V16" />
                    <path d="M4 10H16" />
                    </svg>
                    <span style={{ color: textStyle }}>키워드 추가하기</span>
                </div>
            </div>
        </div>

        {deleteTarget && (
           <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 50 }}>
             <div className="bg-white w-64 rounded-xl shadow-xl p-5 text-center" style={{ width: "260px", backgroundColor: isLight ? "white" : "#374151", borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
               <p className="mb-6 font-medium" style={{ fontSize: "16px", marginBottom: "24px", color: textStyle, fontWeight: 500 }}>"{deleteTarget}" 를 <br/> 삭제하겠습니까?</p>
               <div className="flex justify-between mt-3 gap-2" style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', gap: '35px' }}>
                 <button className="px-4 py-2 bg-gray-300 rounded-lg w-24" style={{ backgroundColor: "#e5e7eb", width: "90px", padding: "8px 0", borderRadius: "8px", fontWeight: 500, color: 'black' }} onClick={closeModal}>아니요</button>
                 <button className="px-4 py-2 bg-red-500 text-white rounded-lg w-24" style={{ backgroundColor: "#ef4444", color: "white", width: "90px", padding: "8px 0", borderRadius: "8px", fontWeight: 500 }} onClick={deleteKeyword}>예</button>
               </div>
             </div>
           </div>
         )}

        <div className="w-full h-8 flex justify-center items-start pt-1 shrink-0 transition-colors duration-300" style={{ width: '100%', height: '32px', backgroundColor: bgStyle, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', flexShrink: 0 }}>
          <div className="w-32 h-1.5 bg-gray-300 rounded-full" style={{ width: '128px', height: '6px', backgroundColor: isLight ? '#d1d5db' : '#4b5563', borderRadius: '9999px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Keyword;
