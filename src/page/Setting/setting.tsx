import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png';

const NAV_MAIN = [
  { icon: '🏠', label: '대시보드', path: '/dashboard' },
  { icon: '📢', label: '공지·정보', path: '/notices' },
  { icon: '🏷️', label: '키워드 관리', path: '/keyword' },
  { icon: '🔗', label: '앱 연동', path: '/apps' },
  { icon: '🗺️', label: '캠퍼스 지도', path: '/map', badge: 'NEW' },
];

const NAV_SETTINGS = [
  { icon: '🔔', label: '알림 설정', path: '/notifications' },
  { icon: '👤', label: '회원 설정', path: '/member' },
];

const inputStyle = (disabled = false): React.CSSProperties => ({
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '15px',
  color: disabled ? '#9ca3af' : '#111827',
  backgroundColor: disabled ? '#f9fafb' : 'white',
  outline: 'none',
  boxSizing: 'border-box',
  cursor: disabled ? 'not-allowed' : 'text',
});

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
};

const MemberInfoSetting: React.FC = () => {
  const navigate = useNavigate();

  const [editable, setEditable] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const handlePwChange = () => {
    if (!pwForm.current) { setPwError('현재 비밀번호를 입력해주세요.'); return; }
    if (pwForm.next.length < 8) { setPwError('새 비밀번호는 8자 이상이어야 합니다.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('새 비밀번호가 일치하지 않습니다.'); return; }
    setPwError('');
    setPwSuccess(true);
  };

  const closePwModal = () => {
    setShowPwModal(false);
    setPwForm({ current: '', next: '', confirm: '' });
    setPwError('');
    setPwSuccess(false);
  };

  const EyeIcon = ({ show }: { show: boolean }) => show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const [form, setForm] = useState({
    name: '정하나',
    studentId: '2024000000',
    major: '스마트융합공학부 스마트ICT융합 전공',
    grade: '2',
    email: 'jeonghan0104@hanyang.ac.kr',
    phone: '010-0000-0000',
    cycle: '1주일',
    notify: true,
  });

  const formatPhone = (val: string) => {
    const n = val.replace(/[^0-9]/g, '');
    if (n.length <= 3) return n;
    if (n.length <= 7) return `${n.slice(0,3)}-${n.slice(3)}`;
    return `${n.slice(0,3)}-${n.slice(3,7)}-${n.slice(7,11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setForm(f => ({ ...f, phone: formatPhone(value) }));
      return;
    }
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", backgroundColor: '#f1f5f9' }}>

      {/* ── 사이드바 ── */}
      <div style={{ width: '210px', height: '100vh', flexShrink: 0, background: 'linear-gradient(180deg, #0a1628 0%, #0d1b3e 100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* 로고 */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <img src={CatLogo} alt="비서냥이" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
            <div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '15px', lineHeight: 1.2 }}>비서냥이</div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px' }}>ERICA 플랫폼</div>
            </div>
          </div>
        </div>

        {/* 네비 */}
        <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', padding: '0 8px', marginBottom: '6px' }}>개인</p>
          {NAV_MAIN.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 10px', borderRadius: '8px', marginBottom: '2px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize: '9px', backgroundColor: '#2563eb', color: 'white', padding: '2px 5px', borderRadius: '4px', fontWeight: '700' }}>{item.badge}</span>}
            </button>
          ))}

          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', padding: '12px 8px 6px', marginBottom: '6px' }}>설정</p>
          {NAV_SETTINGS.map(item => {
            const isActive = item.path === '/member';
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 10px', borderRadius: '8px', marginBottom: '2px', background: isActive ? 'rgba(37,99,235,0.28)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                <span style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: isActive ? '700' : '400' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 유저 */}
        <div style={{ padding: '14px 14px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>조</div>
            <div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>조에인</div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px' }}>스마트융합공학부</div>
            </div>
          </div>
          <button onClick={() => navigate('/login')}
            style={{ width: '100%', padding: '7px', backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '7px', cursor: 'pointer', fontSize: '12px' }}>
            로그아웃
          </button>
        </div>
      </div>

      {/* ── 메인 영역 ── */}
      <div style={{ flex: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* 상단 헤더 */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>회원 설정</h1>
        </div>

        {/* 스크롤 콘텐츠 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>

            {/* 프로필 카드 */}
            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '24px', flexShrink: 0 }}>
                {form.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{form.name}</div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>{form.major}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>{form.email}</div>
              </div>
            </div>

            {/* 폼 카드 */}
            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '28px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 22px', paddingBottom: '14px', borderBottom: '1px solid #f3f4f6' }}>기본 정보</h2>

              {/* 2열 그리드 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>이름</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    readOnly={!editable}
                    style={inputStyle(!editable)}
                    onFocus={e => editable && (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>학번</label>
                  <input
                    value={form.studentId}
                    readOnly
                    style={inputStyle(true)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>비밀번호</label>
                <button
                  onClick={() => setShowPwModal(true)}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', color: '#6b7280', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>비밀번호 변경하기</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>학부/전공</label>
                <input
                  value={form.major}
                  readOnly
                  style={inputStyle(true)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>학년</label>
                  <input
                    name="grade"
                    type="number"
                    min={1}
                    max={4}
                    value={form.grade}
                    onChange={handleChange}
                    readOnly={!editable}
                    style={inputStyle(!editable)}
                    onFocus={e => editable && (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>이메일</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly={!editable}
                    style={inputStyle(!editable)}
                    onFocus={e => editable && (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>전화번호</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  readOnly={!editable}
                  placeholder="010-0000-0000"
                  style={inputStyle(!editable)}
                  onFocus={e => editable && (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
            </div>

            {/* 알림 설정 카드 */}
            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '28px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 22px', paddingBottom: '14px', borderBottom: '1px solid #f3f4f6' }}>알림 설정</h2>

              {/* 키워드 주기 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>키워드 자동검색 주기</label>
                <select
                  name="cycle"
                  disabled={!editable}
                  value={form.cycle}
                  onChange={handleChange}
                  style={{ ...inputStyle(!editable), appearance: 'none' as any }}
                >
                  <option>1일</option>
                  <option>1주일</option>
                  <option>1개월</option>
                </select>
              </div>

              {/* 알림 토글 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>푸시 알림</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>새 공지사항 알림을 받습니다</div>
                </div>
                <button
                  onClick={() => editable && setForm(f => ({ ...f, notify: !f.notify }))}
                  style={{ width: '48px', height: '26px', borderRadius: '13px', backgroundColor: form.notify ? '#2563eb' : '#d1d5db', border: 'none', cursor: editable ? 'pointer' : 'not-allowed', position: 'relative', transition: 'background-color 0.2s', flexShrink: 0 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: form.notify ? '25px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            </div>

            {/* 수정/저장 버튼 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {editable && (
                <button
                  onClick={() => setEditable(false)}
                  style={{ flex: 1, padding: '14px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  취소
                </button>
              )}
              <button
                onClick={() => setEditable(e => !e)}
                style={{ flex: 2, padding: '14px', backgroundColor: editable ? '#16a34a' : '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                {editable ? '✓ 저장하기' : '정보 수정'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── 비밀번호 변경 모달 ── */}
      {showPwModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px 32px', width: '100%', maxWidth: '420px', margin: '0 16px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            <button onClick={closePwModal}
              style={{ position: 'absolute', top: '18px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '22px', lineHeight: 1 }}>×</button>

            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 6px' }}>비밀번호 변경</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px' }}>현재 비밀번호 확인 후 새 비밀번호를 설정하세요.</p>

            {/* 현재 비밀번호 */}
            {['current', 'next', 'confirm'].map((field, i) => {
              const labels = ['현재 비밀번호', '새 비밀번호', '새 비밀번호 확인'];
              const placeholders = ['현재 비밀번호 입력', '8자 이상 입력', '새 비밀번호 재입력'];
              const shown = showPw[field as keyof typeof showPw];
              return (
                <div key={field} style={{ marginBottom: i < 2 ? '16px' : '8px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>{labels[i]}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={shown ? 'text' : 'password'}
                      value={pwForm[field as keyof typeof pwForm]}
                      onChange={e => { setPwForm(f => ({ ...f, [field]: e.target.value })); setPwError(''); setPwSuccess(false); }}
                      placeholder={placeholders[i]}
                      style={{ width: '100%', padding: '13px 44px 13px 16px', border: pwError && !pwSuccess ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', color: '#111827', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' }}
                      onFocus={e => !pwError && (e.target.style.borderColor = '#2563eb')}
                      onBlur={e => !pwError && (e.target.style.borderColor = '#e5e7eb')}
                    />
                    <button type="button" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field as keyof typeof s] }))}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', display: 'flex', alignItems: 'center' }}>
                      <EyeIcon show={shown} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* 에러/성공 메시지 */}
            {pwError && (
              <p style={{ margin: '8px 0 16px', fontSize: '13px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 14px', marginTop: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>✅</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#166534', margin: 0 }}>비밀번호가 변경되었습니다!</p>
                  <p style={{ fontSize: '12px', color: '#15803d', margin: '2px 0 0' }}>다음 로그인 시 새 비밀번호를 사용하세요.</p>
                </div>
              </div>
            )}

            {!pwSuccess ? (
              <button onClick={handlePwChange}
                style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: pwError ? '0' : '16px', marginBottom: '12px', boxSizing: 'border-box' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563eb')}>
                비밀번호 변경
              </button>
            ) : (
              <button onClick={closePwModal}
                style={{ width: '100%', padding: '14px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '4px', marginBottom: '12px' }}>
                확인
              </button>
            )}

            <button onClick={closePwModal}
              style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'center', fontSize: '14px', color: '#9ca3af', textDecoration: 'underline' }}>
              취소하고 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberInfoSetting;
