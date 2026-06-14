import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png';
import {
  getMyInfo, updateMyInfo, changePassword,
  uploadProfilePhoto, requestEmailVerify, confirmEmailVerify, logout,
} from '../../api/api';

// 업로드 전 이미지를 정사각 max px로 줄이고 JPEG로 압축 (무료 요금제 base64 저장용 — 수십 KB로 축소)
function resizeImage(file: File, max = 256): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('이 브라우저에서 이미지를 처리할 수 없습니다.'));
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => blob
          ? resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }))
          : reject(new Error('이미지 변환에 실패했습니다.')),
        'image/jpeg',
        0.85,
      );
    };
    img.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'));
    img.src = URL.createObjectURL(file);
  });
}

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

  const handlePwChange = async () => {
    if (!pwForm.current) { setPwError('현재 비밀번호를 입력해주세요.'); return; }
    if (pwForm.next.length < 8) { setPwError('새 비밀번호는 8자 이상이어야 합니다.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('새 비밀번호가 일치하지 않습니다.'); return; }
    setPwError('');
    try {
      await changePassword(pwForm.current, pwForm.next);
      setPwSuccess(true);
    } catch (e) {
      setPwError(e instanceof Error ? e.message : '비밀번호 변경에 실패했습니다.');
    }
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
    notice: true,
    keyword: true,
    map: true,
    photoUrl: '',
    emailVerified: false,
    provider: 'local',
  });
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  // 프로필 사진
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  // 이메일 인증 모달
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // 화면 진입 시 서버에서 내 정보 로드
  useEffect(() => {
    getMyInfo()
      .then((u) => {
        setForm({
          name: u.name ?? '',
          studentId: u.studentId ?? '',
          major: u.major ?? '',
          grade: u.grade ?? '',
          email: u.email ?? '',
          phone: u.tel ?? '',
          cycle: u.searchCycle ?? '1주일',
          notice: u.notificationSettings?.notice ?? true,
          keyword: u.notificationSettings?.keyword ?? true,
          map: u.notificationSettings?.map ?? true,
          photoUrl: u.photoUrl ?? '',
          emailVerified: u.emailVerified ?? false,
          provider: u.provider ?? 'local',
        });
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : '정보를 불러오지 못했습니다.'));
  }, []);

  // 저장: 수정 가능한 필드만 서버로 전송
  const handleSave = async () => {
    setSaving(true);
    setLoadError('');
    try {
      const updated = await updateMyInfo({
        name: form.name,
        tel: form.phone,
        grade: form.grade,
        searchCycle: form.cycle,
        notificationSettings: { notice: form.notice, keyword: form.keyword, map: form.map },
      });
      setForm((f) => ({
        ...f,
        name: updated.name,
        phone: updated.tel,
        grade: updated.grade,
        cycle: updated.searchCycle,
        notice: updated.notificationSettings?.notice ?? f.notice,
        keyword: updated.notificationSettings?.keyword ?? f.keyword,
        map: updated.notificationSettings?.map ?? f.map,
      }));
      setEditable(false);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

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

  // 프로필 사진 선택 → 업로드
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    setLoadError('');
    try {
      const resized = await resizeImage(file, 256);
      const url = await uploadProfilePhoto(resized);
      setForm(f => ({ ...f, photoUrl: url }));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : '사진 업로드에 실패했습니다.');
    } finally {
      setPhotoBusy(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  // 이메일 인증
  const openEmailVerify = () => {
    setEmailToVerify(form.email);
    setEmailCode('');
    setEmailMsg('');
    setEmailSent(false);
    setShowEmailModal(true);
  };
  const sendEmailCode = async () => {
    setEmailMsg('');
    try {
      const { devCode } = await requestEmailVerify(emailToVerify);
      setEmailSent(true);
      setEmailMsg(devCode ? `인증코드 발송됨 (개발용 코드: ${devCode})` : '인증코드를 메일로 보냈습니다.');
    } catch (err) {
      setEmailMsg(err instanceof Error ? err.message : '발송에 실패했습니다.');
    }
  };
  const confirmEmailCode = async () => {
    setEmailMsg('');
    try {
      await confirmEmailVerify(emailToVerify, emailCode);
      setForm(f => ({ ...f, email: emailToVerify, emailVerified: true }));
      setShowEmailModal(false);
    } catch (err) {
      setEmailMsg(err instanceof Error ? err.message : '인증에 실패했습니다.');
    }
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px', flexShrink: 0, overflow: 'hidden' }}>
              {form.photoUrl ? <img src={form.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (form.name.charAt(0) || '?')}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{form.name || '사용자'}</div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px' }}>{form.major || form.studentId}</div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }}
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

            {/* 에러 배너 */}
            {loadError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px' }}>
                ⚠ {loadError}
              </div>
            )}

            {/* 프로필 카드 */}
            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '24px', overflow: 'hidden' }}>
                  {form.photoUrl
                    ? <img src={form.photoUrl} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : form.name.charAt(0)}
                </div>
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoBusy}
                  title="사진 변경"
                  style={{ position: 'absolute', right: '-2px', bottom: '-2px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid #e5e7eb', cursor: photoBusy ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </button>
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
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
                {form.provider === 'google' ? (
                  <div style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#6b7280', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🔵</span>
                    구글 계정으로 로그인하여 비밀번호가 없습니다.
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPwModal(true)}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', color: '#6b7280', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>비밀번호 변경하기</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                )}
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
                  <label style={labelStyle}>
                    이메일{' '}
                    {form.emailVerified
                      ? <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ 인증됨</span>
                      : <span style={{ color: '#f59e0b', fontWeight: 700 }}>· 미인증</span>}
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      name="email"
                      value={form.email}
                      readOnly
                      style={{ ...inputStyle(true), flex: 1 }}
                    />
                    <button
                      onClick={openEmailVerify}
                      style={{ flexShrink: 0, padding: '0 14px', border: '1.5px solid #2563eb', borderRadius: '10px', backgroundColor: 'white', color: '#2563eb', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      이메일 인증
                    </button>
                  </div>
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

              {/* 알림 카테고리별 토글 */}
              {([
                { key: 'notice', label: '공지 알림', desc: '새 공지사항 알림을 받습니다' },
                { key: 'keyword', label: '키워드 알림', desc: '등록한 키워드 관련 소식을 받습니다' },
                { key: 'map', label: '지도 알림', desc: '캠퍼스 지도 관련 알림을 받습니다' },
              ] as const).map((item, idx) => {
                const on = form[item.key];
                return (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: idx === 0 ? 0 : '18px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{item.label}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                    <button
                      onClick={() => editable && setForm(f => ({ ...f, [item.key]: !f[item.key] }))}
                      style={{ width: '48px', height: '26px', borderRadius: '13px', backgroundColor: on ? '#2563eb' : '#d1d5db', border: 'none', cursor: editable ? 'pointer' : 'not-allowed', position: 'relative', transition: 'background-color 0.2s', flexShrink: 0 }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: on ? '25px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </button>
                  </div>
                );
              })}
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
                onClick={() => (editable ? handleSave() : setEditable(true))}
                disabled={saving}
                style={{ flex: 2, padding: '14px', backgroundColor: editable ? '#16a34a' : '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
                {editable ? (saving ? '저장 중…' : '✓ 저장하기') : '정보 수정'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── 이메일 인증 모달 ── */}
      {showEmailModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px 32px', width: '100%', maxWidth: '420px', margin: '0 16px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setShowEmailModal(false)}
              style={{ position: 'absolute', top: '18px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '22px', lineHeight: 1 }}>×</button>

            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 6px' }}>이메일 인증</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px' }}>가입한 이메일로 인증코드를 보냅니다. (이메일은 변경할 수 없습니다)</p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>이메일 주소</label>
              <input
                type="email"
                value={emailToVerify}
                readOnly
                placeholder="example@hanyang.ac.kr"
                style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', color: '#6b7280', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>

            {emailSent && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>인증코드 (6자리)</label>
                <input
                  value={emailCode}
                  onChange={e => setEmailCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="123456"
                  style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', color: '#111827', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa', letterSpacing: '4px' }}
                />
              </div>
            )}

            {emailMsg && (
              <p style={{ fontSize: '13px', color: emailMsg.includes('실패') || emailMsg.includes('만료') || emailMsg.includes('올바르') ? '#ef4444' : '#2563eb', margin: '0 0 16px' }}>{emailMsg}</p>
            )}

            {!emailSent ? (
              <button onClick={sendEmailCode}
                style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px', boxSizing: 'border-box' }}>
                인증코드 발송
              </button>
            ) : (
              <button onClick={confirmEmailCode}
                style={{ width: '100%', padding: '14px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px', boxSizing: 'border-box' }}>
                인증 확인
              </button>
            )}
            <button onClick={() => setShowEmailModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'center', fontSize: '14px', color: '#9ca3af', textDecoration: 'underline' }}>
              취소하고 돌아가기
            </button>
          </div>
        </div>
      )}

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
