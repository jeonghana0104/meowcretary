import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordSetting() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

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
        
        {/* 상단 상태바 영역 */}
        <div className="w-full h-6 bg-white shrink-0" style={{ height: '24px', flexShrink: 0, backgroundColor: 'white' }} />
        
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center shrink-0" style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => navigate(-1)} className="mr-4 text-gray-600" style={{ marginRight: '16px', color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}>
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
                    className="w-6 h-6"
                    style={{ width: '24px', height: '24px' }}
                >
                    <path d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800" style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>비밀번호 변경</h2>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <label className="block mb-1 font-medium text-gray-700" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>새 비밀번호</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400"
            style={{ width: '100%', borderWidth: '1px', borderColor: '#d1d5db', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', outline: 'none', boxSizing: 'border-box' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
          />

          <label className="block mb-1 font-medium text-gray-700" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#374151' }}>비밀번호 확인</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-8 focus:outline-none focus:ring-2 focus:ring-purple-400"
            style={{ width: '100%', borderWidth: '1px', borderColor: '#d1d5db', borderRadius: '8px', padding: '12px 16px', marginBottom: '32px', outline: 'none', boxSizing: 'border-box' }}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
          />

          <button className="w-full bg-[#B783FF] hover:bg-[#a36ce0] text-white py-3.5 rounded-lg font-semibold transition-colors mb-3" style={{ width: '100%', backgroundColor: '#B783FF', color: 'white', padding: '14px 0', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', marginBottom: '12px' }}>
            변경하기
          </button>

          <button
            className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium"
            style={{ width: '100%', padding: '12px 0', color: '#6b7280', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>

        {/* 하단 홈 바 */}
        <div className="w-full h-8 bg-white flex justify-center items-start pt-1 shrink-0" style={{ width: '100%', height: '32px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', flexShrink: 0 }}>
          <div className="w-32 h-1.5 bg-gray-300 rounded-full" style={{ width: '128px', height: '6px', backgroundColor: '#d1d5db', borderRadius: '9999px' }}></div>
        </div>

      </div>
    </div>
  );
}
