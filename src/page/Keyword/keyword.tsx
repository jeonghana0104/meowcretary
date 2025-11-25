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
    <div className="w-full max-w-sm mx-auto min-h-screen bg-white flex flex-col">
      {/* iOS Status Bar */}
      <div className="h-11 bg-white flex-shrink-0" />

      {/* Header Section */}
      <header className="px-4 flex flex-col items-center border-b border-gray-200">
        {/* 아이콘 + 비서냥이 */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={CatLogo}
            className="object-contain"
            style={{ width: "20px", height: "20px", marginRight: "10px" }}
          />
          <span className="text-lg font-semibold">비서냥이</span>
        </div>

        {/* 메뉴 + 키워드 설정 */}
        <div
          className="w-full bg-gray-100 flex items-center py-2 mb-2 rounded"
          style={{ paddingLeft: "6px" }}
        >
          {/* 메뉴 아이콘 */}
          <button className="p-0 m-0 mr-2" onClick={() => navigate("/menu")}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ display: "block" }}
            >
              <path d="M3 6H21" />
              <path d="M3 12H21" />
              <path d="M3 18H21" />
            </svg>
          </button>

          <span className="text-lg font-semibold">키워드 설정</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-5 py-4 overflow-y-auto">
        {/* 검색창 */}
        <div className="relative mb-5">
          {/* 검색 아이콘 */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="gray"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.7 }}
            >
              <circle cx="6" cy="6" r="4" />
              <path d="M10 10L13 13" />
            </svg>
          </div>

          {/* 인풋 */}
          <input
            placeholder="검색"
            className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-[#B783FF] focus:outline-none text-gray-700"
            style={{ fontSize: "15px" }}
          />
        </div>

        {/* 키워드 리스트 */}
        <div className="border-t border-gray-300">
          {keywords.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-gray-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-[2px] bg-red-500"></div>
                <span className="text-gray-800">{item}</span>
              </div>

              <button className="p-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  stroke="red"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6L18 18" />
                </svg>
              </button>
            </div>
          ))}

          {/* 키워드 추가 */}
          <div className="flex items-center gap-3 py-3 border-b border-gray-300">
            <svg
              width="20"
              height="20"
              stroke="#4A56E2"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M10 4V16" />
              <path d="M4 10H16" />
            </svg>

            <span className="text-gray-900">키워드 추가하기</span>
          </div>
        </div>
      </main>

      {/* 하단 iOS 바 */}
      <div className="px-4 py-4">
        <div className="w-28 h-1 bg-gray-300 mx-auto rounded-full" />
      </div>
    </div>
  );
};

export default Keyword;
