import React from "react";
import CatLogo from "../../assets/비서냥이.png";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-sm bg-white min-h-screen border border-gray-300 shadow-md">

        {/* 상단 비서냥이 */}
        <header className="w-full border-b px-4 pt-4 pb-3 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <img
              src={CatLogo}
              className="object-contain"
              style={{ width: "20px", height: "20px", marginRight: "6px" }}
            />
            <span className="text-lg font-semibold">비서냥이</span>
          </div>

          {/* 메뉴바 */}
          <div className="w-full flex justify-between items-center bg-gray-200 py-2 px-3 rounded">
            <span className="text-base font-semibold w-full text-center">
              메뉴
            </span>

            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              stroke="black"
              strokeWidth="2"
              fill="none"
              className="ml-auto"
            >
              <path d="M3 6H21" />
              <path d="M3 12H21" />
              <path d="M3 18H21" />
            </svg>
          </div>
        </header>

        {/* 유저 정보 */}
        <div className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">정하나 님</span>

            <div className="flex items-center gap-3">
              <button className="border rounded-full px-3 py-1 text-sm">
                로그인
              </button>

              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                stroke="black"
                strokeWidth="2"
                fill="none"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16 16" />
              </svg>
            </div>
          </div>
        </div>

        {/* 페이지 목록 */}
        <div className="px-4 py-6 space-y-4">
          <p className="text-lg cursor-pointer" onClick={() => navigate("/keyword")}>
            키워드 설정
          </p>

          <p className="text-lg cursor-pointer">정보 대시보드</p>

          <p className="text-lg cursor-pointer" onClick={() => navigate("/member")}>
            회원정보 설정
          </p>
        </div>
      </div>
    </div>
  );
}
