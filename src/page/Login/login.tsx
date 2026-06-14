import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png';
import AuthLeftPanel from '../../components/layout/AuthLeftPanel';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuth } from '../../firebase';
import { login, googleLogin, googleComplete } from '../../api/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // 비밀번호 찾기 모달
  const [showFindPw, setShowFindPw] = useState(false);
  const [findPwEmail, setFindPwEmail] = useState('');
  const [findPwSent, setFindPwSent] = useState(false);

  // 구글 신규 가입 온보딩 (학번 입력)
  const [googleOnboard, setGoogleOnboard] = useState<{ idToken: string; email: string; name: string } | null>(null);
  const [obStudentId, setObStudentId] = useState('');
  const [obDept, setObDept] = useState('');
  const [obGrade, setObGrade] = useState('1학년');
  const [obError, setObError] = useState('');

  // 실제 로그인: 이메일(또는 학번) + 비밀번호 → 백엔드에서 JWT 발급 → 토큰 저장 후 이동
  const handleLogin = async () => {
    if (!studentId.trim() || !password) {
      setLoginError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoggingIn(true);
    setLoginError(null);
    try {
      await login(studentId.trim(), password);
      navigate('/dashboard');
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : '로그인에 실패했습니다.');
    } finally {
      setLoggingIn(false);
    }
  };

  // 구글 로그인: 구글 팝업 인증 → Firebase ID 토큰 → 백엔드(@hanyang 검증) → 우리 JWT
  const handleGoogleLogin = async () => {
    setLoginError(null);
    setLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');   // 이메일 권한 명시 요청 (토큰에 email 포함되게)
      provider.addScope('profile');
      provider.setCustomParameters({ hd: 'hanyang.ac.kr', prompt: 'select_account' }); // 한양 계정 힌트 + 계정 선택 강제
      const result = await signInWithPopup(firebaseAuth, provider);
      const idToken = await result.user.getIdToken(true); // 강제 갱신
      const gRes = await googleLogin(idToken);
      if (gRes.needsOnboarding) {
        // 신규 → 학번 입력 모달 열기
        setObStudentId('');
        setObDept('');
        setObGrade('1학년');
        setObError('');
        setGoogleOnboard({ idToken, email: gRes.email, name: gRes.name });
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      const code = (e as { code?: string })?.code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      setLoginError(e instanceof Error ? e.message : '구글 로그인에 실패했습니다.');
    } finally {
      setLoggingIn(false);
    }
  };

  // 구글 신규 가입 완료 (학번 입력 후)
  const handleGoogleComplete = async () => {
    if (!googleOnboard) return;
    if (!/^\d{6,12}$/.test(obStudentId.trim())) {
      setObError('학번을 숫자로 입력해주세요.');
      return;
    }
    setObError('');
    try {
      await googleComplete({
        idToken: googleOnboard.idToken,
        studentId: obStudentId.trim(),
        dept: obDept.trim(),
        grade: obGrade,
      });
      setGoogleOnboard(null);
      navigate('/dashboard');
    } catch (e) {
      setObError(e instanceof Error ? e.message : '가입에 실패했습니다.');
    }
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
            <button onClick={handleLogin} disabled={loggingIn}
              style={{ width: '100%', padding: '17px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: '700', cursor: loggingIn ? 'not-allowed' : 'pointer', opacity: loggingIn ? 0.6 : 1, marginBottom: '32px', boxSizing: 'border-box' }}
              onMouseEnter={(e) => !loggingIn && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}>
              {loggingIn ? '로그인 중…' : '로그인'}
            </button>

            {/* 구분선 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>또는</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>

            {/* 구글 로그인 버튼 */}
            <button onClick={handleGoogleLogin} disabled={loggingIn}
              style={{ width: '100%', padding: '15px', backgroundColor: 'white', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: loggingIn ? 'not-allowed' : 'pointer', marginBottom: '32px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onMouseEnter={(e) => !loggingIn && (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              한양대 구글 계정으로 로그인
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

      {/* ── 구글 신규 가입 온보딩 모달 (학번 입력) ── */}
      {googleOnboard && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px 32px', width: '100%', maxWidth: '420px', margin: '0 16px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setGoogleOnboard(null)}
              style={{ position: 'absolute', top: '18px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '22px', lineHeight: 1 }}>×</button>

            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 6px' }}>학번 정보 입력</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px' }}>
              <strong style={{ color: '#2563eb' }}>{googleOnboard.name || googleOnboard.email}</strong> 님, 처음이시네요! 가입 완료를 위해 학번을 입력해주세요.
            </p>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }}>{googleOnboard.email}</p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>학번 *</label>
              <input value={obStudentId} onChange={e => setObStudentId(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="2024XXXXXX"
                style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', color: '#111827', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: obError ? '12px' : '24px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>학과</label>
                <input value={obDept} onChange={e => setObDept(e.target.value)} placeholder="소프트웨어학부"
                  style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', color: '#111827', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>학년</label>
                <select value={obGrade} onChange={e => setObGrade(e.target.value)}
                  style={{ width: '100%', padding: '13px 10px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', color: '#111827', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white' }}>
                  {['1학년', '2학년', '3학년', '4학년'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {obError && <p style={{ fontSize: '13px', color: '#ef4444', margin: '0 0 16px' }}>{obError}</p>}

            <button onClick={handleGoogleComplete}
              style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '10px', boxSizing: 'border-box' }}>
              가입 완료하고 시작하기
            </button>
            <button onClick={() => setGoogleOnboard(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'center', fontSize: '14px', color: '#9ca3af', textDecoration: 'underline' }}>
              취소
            </button>
          </div>
        </div>
      )}

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
