import React from 'react';
import CatLogo from '../../assets/react.svg'; // 로고 이미지가 없어서 임시로 react 로고 사용 (나중에 친구랑 같은 걸로 바꾸세요)
import { useNavigate } from 'react-router-dom';

interface MobileLayoutProps {
  title: string;
  children: React.ReactNode;
  showBackBtn?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ title, children, showBackBtn = false }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-sm bg-white min-h-screen border border-gray-300 shadow-md flex flex-col relative">
        
        {/* iOS Status Bar 느낌의 여백 */}
        <div className="h-11 bg-white flex-shrink-0" />

        {/* 공통 헤더 */}
        <header className="w-full px-4 pt-2 pb-3 flex flex-col items-center border-b border-gray-100">
          {/* 로고 + 앱 이름 */}
          <div className="flex items-center gap-2 mb-3">
            {/* 친구 코드의 로고 부분 */}
            <img src={CatLogo} className="w-5 h-5 object-contain" alt="logo" />
            <span className="text-lg font-bold text-gray-800">비서냥이</span>
          </div>

          {/* 페이지 제목 바 (친구 스타일 적용) */}
          <div className="w-full flex items-center bg-gray-100 py-2 px-3 rounded-lg relative">
            {showBackBtn && (
              <button 
                onClick={() => navigate(-1)} 
                className="absolute left-3 p-1 text-gray-600 hover:text-black"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <span className="text-base font-semibold w-full text-center text-gray-800">
              {title}
            </span>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 w-full overflow-y-auto">
          {children}
        </main>

        {/* 하단 iOS Home Indicator */}
        <div className="px-4 py-4 bg-white flex-shrink-0">
          <div className="w-28 h-1 bg-gray-300 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;