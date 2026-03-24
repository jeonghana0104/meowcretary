import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png';

/* ── 공용 스타일 ── */
const lbl: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' };
const inp = (err = false): React.CSSProperties => ({ width: '100%', padding: '12px 14px', border: `1.5px solid ${err ? '#ef4444' : '#e5e7eb'}`, borderRadius: '10px', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' });
const sel: React.CSSProperties = { width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#111827', outline: 'none', backgroundColor: 'white', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' };
const btnPrimary: React.CSSProperties = { width: '100%', padding: '15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxSizing: 'border-box' };
const btnSecondary: React.CSSProperties = { width: '100%', padding: '15px', backgroundColor: 'white', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxSizing: 'border-box' };
const eyeBtn: React.CSSProperties = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' };
const focusIn = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#2563eb'; };
const focusOut = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#e5e7eb'; };
const EyeIcon = ({ show }: { show: boolean }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {show ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
  </svg>
);

const STEPS = [
  { num: '01', label: '계정 정보', sub: '이름·학번·이메일' },
  { num: '02', label: '학교 정보', sub: '학과·학년 선택' },
  { num: '03', label: '완료', sub: '비서냥이 시작!' },
];

const COLLEGES = ['ICT융합대학', '공학대학', '자연과학대학', '사회과학대학', '경상대학', '언어문화교육원'];
const DEPTS: Record<string, string[]> = {
  'ICT융합대학': ['소프트웨어학부', '전자공학부', 'ICT융합학부'],
  '공학대학': ['기계공학과', '화학공학과', '건축학부'],
  '자연과학대학': ['수학과', '물리학과', '화학과'],
  '사회과학대학': ['행정학과', '사회학과', '미디어커뮤니케이션학과'],
  '경상대학': ['경제학부', '경영학부', '회계세무학과'],
  '언어문화교육원': ['국어국문학과', '영어영문학과'],
};

/* ── 왼쪽 패널 ── */
const LeftPanel: React.FC<{ step: number }> = ({ step }) => (
  <div
    className="hidden md:flex"
    style={{ width: '42%', height: '100vh', background: 'linear-gradient(160deg, #0a1628 0%, #0f2044 40%, #0d1b3e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px 140px', gap: '48px', flexShrink: 0 }}
  >
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, #1e3a6e 0%, #152d5a 60%, transparent 100%)', zIndex: 0 }} />
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '48px' }}>
        <img src={CatLogo} alt="비서냥이" style={{ width: '150px', height: '150px', objectFit: 'contain', marginBottom: '6px' }} />
        <h1 style={{ color: 'white', fontSize: '38px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.5px' }}>비서냥이</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: 0 }}>새 계정 만들기</p>
      </div>
    </div>
    <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {STEPS.map((s, i) => {
        const stepNum = i + 1;
        const isActive = step === stepNum;
        const isDone = step > stepNum;
        return (
          <div key={s.num} style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '14px 18px', borderRadius: '14px',
            backgroundColor: isActive ? 'rgba(37,99,235,0.25)' : isDone ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: isActive ? '1px solid rgba(96,165,250,0.4)' : '1px solid transparent',
            transition: 'all 0.2s',
          }}>
            {/* 아이콘 */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              backgroundColor: isDone ? 'rgba(34,197,94,0.2)' : isActive ? '#2563eb' : 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: '700',
              color: isDone ? '#4ade80' : isActive ? 'white' : 'rgba(255,255,255,0.25)',
            }}>
              {isDone ? '✓' : stepNum}
            </div>
            {/* 텍스트 */}
            <div style={{ flex: 1 }}>
              <div style={{ color: isActive ? 'white' : isDone ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)', fontSize: '15px', fontWeight: isActive ? '700' : '500', lineHeight: 1.2 }}>{s.label}</div>
              <div style={{ color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)', fontSize: '12px', marginTop: '3px' }}>{s.sub}</div>
            </div>
            {/* 활성 표시 */}
            {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60a5fa', flexShrink: 0 }} />}
          </div>
        );
      })}
    </div>
  </div>
);

/* ── Step1 ── */
interface Step1Props {
  name: string; setName: (v: string) => void;
  studentId: string; setStudentId: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  passwordConfirm: string; setPasswordConfirm: (v: string) => void;
  showPw: boolean; setShowPw: (v: boolean) => void;
  showPwConfirm: boolean; setShowPwConfirm: (v: boolean) => void;
  agreed: boolean; setAgreed: (v: boolean) => void;
  onNext: () => void;
  onLogin: () => void;
}
const Step1: React.FC<Step1Props> = ({ name, setName, studentId, setStudentId, email, setEmail, password, setPassword, passwordConfirm, setPasswordConfirm, showPw, setShowPw, showPwConfirm, setShowPwConfirm, agreed, setAgreed, onNext, onLogin }) => {
  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const pwStrengthColor = ['#e5e7eb', '#ef4444', '#f59e0b', '#22c55e'][pwStrength];
  const pwStrengthLabel = ['', '약함', '보통', '강함'][pwStrength];
  const pwMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  return (
    <div style={{ flex: 1, height: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 48px', borderBottom: '2px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={CatLogo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span style={{ fontWeight: '700', fontSize: '17px', color: '#111827' }}>비서냥이</span>
        </div>
        <span onClick={onLogin} style={{ fontSize: '14px', color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>로그인 →</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 6px' }}>계정 정보를 입력해주세요</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px' }}>단계 1/3 — 기본 계정 정보를 입력해주세요.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={lbl}>이름</label>
              <input type="text" placeholder="홍길동" value={name} onChange={e => setName(e.target.value)} style={inp()} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <label style={lbl}>학번</label>
              <input type="text" placeholder="2024XXXXX" value={studentId} onChange={e => setStudentId(e.target.value)} style={inp()} onFocus={focusIn} onBlur={focusOut} />
            </div>
          </div>

          <div style={{ marginBottom: '6px' }}>
            <label style={lbl}>이메일</label>
            <input type="email" placeholder="your-id@hanyang.ac.kr" value={email} onChange={e => setEmail(e.target.value)} style={inp()} onFocus={focusIn} onBlur={focusOut} />
          </div>
          <p style={{ fontSize: '12px', color: '#2563eb', margin: '0 0 14px' }}>ℹ 한양대학교 이메일(@hanyang.ac.kr)로 인증이 필요합니다.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '8px' }}>
            <div>
              <label style={lbl}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} placeholder="8자리 이상" value={password} onChange={e => setPassword(e.target.value)} style={inp()} onFocus={focusIn} onBlur={focusOut} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={eyeBtn}><EyeIcon show={showPw} /></button>
              </div>
            </div>
            <div>
              <label style={lbl}>비밀번호 확인</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwConfirm ? 'text' : 'password'} placeholder="동일하게 입력" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} style={inp(pwMismatch)} onFocus={focusIn} onBlur={focusOut} />
                <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)} style={eyeBtn}><EyeIcon show={showPwConfirm} /></button>
              </div>
            </div>
          </div>

          {password.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                <div style={{ width: `${(pwStrength / 3) * 100}%`, height: '100%', backgroundColor: pwStrengthColor, transition: 'all 0.3s' }} />
              </div>
              <span style={{ fontSize: '12px', color: pwStrengthColor, fontWeight: '600', minWidth: '24px' }}>{pwStrengthLabel}</span>
            </div>
          )}

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: `1.5px solid ${agreed ? '#2563eb' : '#e5e7eb'}`, borderRadius: '10px', cursor: 'pointer', marginBottom: '24px', backgroundColor: agreed ? '#eff6ff' : 'white' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#2563eb' }} />
            <span style={{ fontSize: '14px', color: '#374151' }}>이용약관 및 개인정보 처리방침에 동의합니다.</span>
          </label>

          <button onClick={onNext} style={btnPrimary} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563eb')}>
            다음 단계 →
          </button>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', margin: '16px 0 0' }}>
            이미 계정이 있으신가요?{' '}
            <span onClick={onLogin} style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer' }}>로그인 →</span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Step2 ── */
interface Step2Props {
  studentId: string;
  college: string; setCollege: (v: string) => void;
  dept: string; setDept: (v: string) => void;
  grade: string; setGrade: (v: string) => void;
  admYear: string; setAdmYear: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}
const Step2: React.FC<Step2Props> = ({ studentId, college, setCollege, dept, setDept, grade, setGrade, admYear, setAdmYear, onNext, onBack }) => (
  <div style={{ flex: 1, height: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: '20px 48px', borderBottom: '2px solid #2563eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img src={CatLogo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
      <span style={{ fontWeight: '700', fontSize: '17px', color: '#111827' }}>비서냥이</span>
    </div>
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 6px' }}>학교 정보를 알려주세요</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px' }}>단계 2/3 — 맞춤형 정보 수집을 위해 학교 정보가 필요해요.</p>

        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>대학교</label>
          <div style={{ padding: '13px 16px', border: '1.5px solid #2563eb', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '15px', color: '#1d4ed8', fontWeight: '500' }}>한양대학교 ERICA &nbsp;✓ 자동 확인됨</span>
            <span style={{ fontSize: '12px', backgroundColor: '#2563eb', color: 'white', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>✓ 인증됨</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label style={lbl}>단과대학</label>
            <select value={college} onChange={e => { setCollege(e.target.value); setDept(DEPTS[e.target.value][0]); }} style={sel}>
              {COLLEGES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>학과/부</label>
            <select value={dept} onChange={e => setDept(e.target.value)} style={sel}>
              {(DEPTS[college] || []).map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label style={lbl}>학년</label>
            <select value={grade} onChange={e => setGrade(e.target.value)} style={sel}>
              {['1학년', '2학년', '3학년', '4학년'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>입학년도</label>
            <select value={admYear} onChange={e => setAdmYear(e.target.value)} style={sel}>
              {['2024년', '2023년', '2022년', '2021년', '2020년'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '6px' }}>
          <label style={lbl}>학번</label>
          <input type="text" value={studentId} readOnly style={{ ...inp(), backgroundColor: '#f9fafb', color: '#6b7280' }} />
        </div>
        <p style={{ fontSize: '12px', color: '#f59e0b', margin: '0 0 24px' }}>⚠ 학번은 졸업까지 변경할 수 없습니다.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
          <button onClick={onBack} style={btnSecondary} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>← 이전으로</button>
          <button onClick={onNext} style={btnPrimary} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563eb')}>가입 완료 →</button>
        </div>
      </div>
    </div>
  </div>
);

/* ── Step3 ── */
interface Step3Props { name: string; onDashboard: () => void; onKeyword: () => void; }
const Step3: React.FC<Step3Props> = ({ name, onDashboard, onKeyword }) => (
  <div style={{ flex: 1, height: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: '20px 48px', borderBottom: '2px solid #2563eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img src={CatLogo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
      <span style={{ fontWeight: '700', fontSize: '17px', color: '#111827' }}>비서냥이</span>
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px', color: '#16a34a' }}>✓</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 12px' }}>가입이 완료되었습니다!</h2>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 36px', lineHeight: 1.6 }}>
          환영합니다, {name || '홍길동'} 님!<br />비서냥이와 함께 ERICA 생활을 스마트하게 시작해보세요.
        </p>
        <button onClick={onDashboard} style={{ ...btnPrimary, marginBottom: '12px' }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563eb')}>
          대시보드로 이동 →
        </button>
        <button onClick={onKeyword} style={btnSecondary} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
          먼저 키워드를 설정해볼까요? →
        </button>
      </div>
    </div>
  </div>
);

/* ── 메인 Signup ── */
const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [college, setCollege] = useState('ICT융합대학');
  const [dept, setDept] = useState('소프트웨어학부');
  const [grade, setGrade] = useState('1학년');
  const [admYear, setAdmYear] = useState('2024년');

  const handleStep1Next = () => {
    if (!name || !studentId || !email || !password || !passwordConfirm) return alert('모든 항목을 입력해주세요.');
    if (password !== passwordConfirm) return alert('비밀번호가 일치하지 않습니다.');
    if (!agreed) return alert('이용약관에 동의해주세요.');
    setStep(2);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      <LeftPanel step={step} />
      {step === 1 && (
        <Step1
          name={name} setName={setName}
          studentId={studentId} setStudentId={setStudentId}
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          passwordConfirm={passwordConfirm} setPasswordConfirm={setPasswordConfirm}
          showPw={showPw} setShowPw={setShowPw}
          showPwConfirm={showPwConfirm} setShowPwConfirm={setShowPwConfirm}
          agreed={agreed} setAgreed={setAgreed}
          onNext={handleStep1Next}
          onLogin={() => navigate('/login')}
        />
      )}
      {step === 2 && (
        <Step2
          studentId={studentId}
          college={college} setCollege={setCollege}
          dept={dept} setDept={setDept}
          grade={grade} setGrade={setGrade}
          admYear={admYear} setAdmYear={setAdmYear}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3
          name={name}
          onDashboard={() => navigate('/dashboard')}
          onKeyword={() => navigate('/keyword')}
        />
      )}
    </div>
  );
};

export default Signup;
