import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png';
import AuthLeftPanel from '../../components/layout/AuthLeftPanel';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // 비밀번호 찾기 모달
  const [showFindPw, setShowFindPw] = useState(false);
  const [findPwEmail, setFindPwEmail] = useState('');
  const [findPwSent, setFindPwSent] = useState(false);

  const handleLogin = () => {
    if (password !== '1234') {
      setLoginError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoginError(null);
    navigate('/dashboard');
  };

  const handleFindPw = () => {
    if (!findPwEmail.includes('@hanyang.ac.kr')) return;
    setFindPwSent(true);
  };

  const closeFindPw = () => {
    setShowFindPw(false);
    setFindPwEmail('');
    setFindPwSent(false);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", position: 'relative' }}>

      <AuthLeftPanel />

      {/* ── 오른쪽 패널 ── */}
      <div style={{ flex: 1, height: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>

        {/* 상단 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 52px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={CatLogo} alt="비서냥이" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
            <span style={{ fontWeight: '700', fontSize: '20px', color: '#111827' }}>비서냥이</span>
          </div>
          <span onClick={() => navigate('/signup')} style={{ fontWeight: '700', fontSize: '16px', color: '#2563eb', cursor: 'pointer' }}>
            회원가입 →
          </span>
        </div>

        {/* 폼 영역 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
          <div style={{ width: '100%', maxWidth: '460px' }}>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#111827', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
                다시 만나서 반가워요 👋
              </h2>
              <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                이메일과 비밀번호를 입력해주세요.
              </p>
            </div>

            {/* 이메일 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>이메일</label>
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={{ width: '100%', padding: '15px 18px', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', color: '#111827', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* 비밀번호 */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                  style={{ width: '100%', padding: '15px 50px 15px 18px', border: loginError ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', color: '#111827', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' }}
                  onFocus={(e) => !loginError && (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => !loginError && (e.target.style.borderColor = '#e5e7eb')}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {loginError && (
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {loginError}
                </p>
              )}
            </div>

            {/* 자동 로그인 + 비밀번호 찾기 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px', color: '#6b7280' }}>
                <input type="checkbox" checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}
                  style={{ width: '17px', height: '17px', accentColor: '#2563eb', cursor: 'pointer' }} />
                자동 로그인
              </label>
              <button onClick={() => setShowFindPw(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: '#6b7280', textDecoration: 'underline' }}>
                비밀번호 찾기
              </button>
            </div>

            {/* 로그인 버튼 */}
            <button onClick={handleLogin}
              style={{ width: '100%', padding: '17px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: '700', cursor: 'pointer', marginBottom: '32px', boxSizing: 'border-box' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}>
              로그인
            </button>

            <p style={{ textAlign: 'center', fontSize: '16px', color: '#6b7280', margin: 0 }}>
              아직 계정이 없으신가요?{' '}
              <span onClick={() => navigate('/signup')}
                style={{ color: '#2563eb', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>
                회원가입 →
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── 비밀번호 찾기 모달 ── */}
      {showFindPw && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px 32px', width: '100%', maxWidth: '400px', margin: '0 16px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            {/* 닫기 버튼 */}
            <button onClick={closeFindPw}
              style={{ position: 'absolute', top: '18px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '22px', lineHeight: 1 }}>
              ×
            </button>

            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px' }}>비밀번호 찾기</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px' }}>
              가입한 이메일로 재설정 링크를 발송해드립니다.
            </p>

            {/* 이메일 입력 */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>이메일 주소</label>
              <input
                type="email"
                placeholder="example@hanyang.ac.kr"
                value={findPwEmail}
                onChange={(e) => setFindPwEmail(e.target.value)}
                style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa', color: '#111827' }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <p style={{ fontSize: '13px', color: '#f59e0b', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              🔑 학교 이메일(@hanyang.ac.kr)을 입력해주세요.
            </p>

            {/* 발송 버튼 */}
            <button onClick={handleFindPw}
              style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '16px', boxSizing: 'border-box' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}>
              재설정 링크 발송
            </button>

            {/* 성공 메시지 */}
            {findPwSent && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>✅</span>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#166534', margin: '0 0 4px' }}>이메일이 발송되었습니다!</p>
                  <p style={{ fontSize: '13px', color: '#15803d', margin: 0 }}>메일함을 확인해 재설정 링크를 클릭해주세요.</p>
                </div>
              </div>
            )}

            <button onClick={closeFindPw}
              style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'center', fontSize: '14px', color: '#9ca3af', textDecoration: 'underline' }}>
              취소하고 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
