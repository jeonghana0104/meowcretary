import React from 'react';
// 로고 이미지가 없다면 텍스트로 대체하거나 경로를 맞춰주세요.
import CatLogo from '../../assets/비서냥이.png'; 
import { useNavigate } from 'react-router-dom';

interface MobileLayoutProps {
  title?: string; // 헤더 제목 (옵션)
  children: React.ReactNode; // 페이지 내용
  showBackBtn?: boolean; // 뒤로가기 버튼 표시 여부
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ title = "비서냥이", children, showBackBtn = false }) => {
  const navigate = useNavigate();

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
        
        {/* 상단 여백 (Status Bar) */}
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
            {showBackBtn ? (
              <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4b5563' }}>
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            ) : (
              <div style={{ width: '24px' }}></div> // spacer
            )}

            <span className="text-base font-bold text-gray-800" style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
              {title}
            </span>
            
            {/* 우측 햄버거 아이콘 (장식용 혹은 메뉴 이동용) */}
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
          {children}
        </div>

        {/* 하단 홈 바 */}
        <div className="w-full h-8 bg-white flex justify-center items-start pt-1 shrink-0" style={{ width: '100%', height: '32px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', flexShrink: 0 }}>
          <div className="w-32 h-1.5 bg-gray-300 rounded-full" style={{ width: '128px', height: '6px', backgroundColor: '#d1d5db', borderRadius: '9999px' }}></div>
        </div>

      </div>
    </div>
  );
};

export default MobileLayout;