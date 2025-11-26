import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. 에러 메시지를 저장할 상태(State) 추가
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = () => {
    // 2. 시연용 비밀번호 검사 로직
    if (password !== '12341234') {
      // 틀리면 에러 메시지 설정 (로그인은 진행 안 함)
      setLoginError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 맞으면 에러 초기화하고 로그인 성공 처리
    setLoginError(null);
    console.log('로그인 성공:', { studentId });
    navigate('/menu');
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <div 
        className="w-[390px] h-[800px] bg-white border-[14px] border-black rounded-[45px] shadow-2xl flex flex-col overflow-hidden relative"
        style={{
            width: '390px', height: '800px', backgroundColor: 'white', border: '14px solid black', borderRadius: '45px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column'
        }}
      >
        
        <div className="w-full h-6 bg-white shrink-0" style={{ height: '24px', flexShrink: 0 }}></div>

        <header className="w-full px-5 pb-4 flex flex-col items-center border-b border-gray-100 shrink-0" style={{ padding: '0 20px 16px', borderBottom: '1px solid #f3f4f6' }}>
          <div className="flex items-center mb-4" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <img src={CatLogo} alt="Logo" className="w-5 h-5 mr-1.5 object-contain" style={{ width: '20px', height: '20px', marginRight: '6px', objectFit: 'contain' }} />
            <span className="text-lg font-bold text-gray-800" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>비서냥이</span>
          </div>

          <div className="w-full bg-gray-100 py-3 px-4 rounded-lg flex items-center justify-between relative" style={{ width: '100%', backgroundColor: '#f3f4f6', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: '24px' }}></div>
            <span className="text-base font-bold text-gray-800" style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>로그인</span>
            <div style={{ width: '24px' }}></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-center px-6" style={{ flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div className="mb-8 text-center" style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>환영합니다! 👋</h2>
            <p className="text-gray-500 text-sm" style={{ color: '#6b7280', fontSize: '14px' }}>학교 생활의 모든 정보, 비서냥이와 함께하세요.</p>
          </div>

          <div className="space-y-4 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <InputField label="학번" placeholder="학번을 입력하세요" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            <InputField label="비밀번호" type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {/* 3. 에러 메시지 박스 (에러가 있을 때만 표시) */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-pulse" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {loginError}
              </div>
            )}
          </div>

          <Button text="로그인" onClick={handleLogin} />

          <div className="mt-6 text-center" style={{ marginTop: '24px', textAlign: 'center' }}>
            <button onClick={() => navigate('/signup')} className="text-sm text-gray-500 hover:text-purple-600 transition-colors" style={{ fontSize: '14px', color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none' }}>
              아직 계정이 없으신가요? <span className="font-bold underline" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>회원가입</span>
            </button>
          </div>

        </div>

        <div className="w-full h-8 bg-white flex justify-center items-start pt-1 shrink-0" style={{ width: '100%', height: '32px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', flexShrink: 0 }}>
          <div className="w-32 h-1.5 bg-gray-300 rounded-full" style={{ width: '128px', height: '6px', backgroundColor: '#d1d5db', borderRadius: '9999px' }}></div>
        </div>

      </div>
    </div>
  );
};

export default Login;