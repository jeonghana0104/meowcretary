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

const Toggle: React.FC<{ enabled: boolean; onChange: () => void; disabled?: boolean }> = ({ enabled, onChange, disabled }) => (
  <button onClick={disabled ? undefined : onChange}
    style={{ width: '48px', height: '26px', borderRadius: '13px', backgroundColor: enabled ? '#2563eb' : '#d1d5db', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', position: 'relative', transition: 'background-color 0.2s', flexShrink: 0 }}>
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: enabled ? '25px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
  </button>
);

const SectionCard: React.FC<{ title: string; desc?: string; children: React.ReactNode }> = ({ title, desc, children }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px 28px', marginBottom: '16px' }}>
    <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f3f4f6' }}>
      <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 }}>{title}</h2>
      {desc && <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0 0' }}>{desc}</p>}
    </div>
    {children}
  </div>
);

const ToggleRow: React.FC<{ icon: string; label: string; desc: string; enabled: boolean; onChange: () => void; disabled?: boolean }> = ({ icon, label, desc, enabled, onChange, disabled }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f9fafb' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '9px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: disabled ? '#9ca3af' : '#111827' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{desc}</div>
      </div>
    </div>
    <Toggle enabled={enabled} onChange={onChange} disabled={disabled} />
  </div>
);

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();

  const [masterOn, setMasterOn] = useState(true);

  const [channels, setChannels] = useState({
    push: true,
    email: true,
    sms: false,
  });

  const [sources, setSources] = useState({
    lms: true,
    scholarship: true,
    portal: true,
    erica: true,
    career: false,
  });

  const [keyword, setKeyword] = useState(true);
  const [deadline, setDeadline] = useState(true);
  const [quietHour, setQuietHour] = useState(true);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd]   = useState('08:00');
  const [cycle, setCycle] = useState('즉시');

  const toggle = (obj: any, set: any, key: string) => set({ ...obj, [key]: !obj[key] });

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", backgroundColor: '#f1f5f9' }}>

      {/* ── 사이드바 ── */}
      <div style={{ width: '210px', height: '100vh', flexShrink: 0, background: 'linear-gradient(180deg, #0a1628 0%, #0d1b3e 100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <img src={CatLogo} alt="비서냥이" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
            <div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '15px', lineHeight: 1.2 }}>비서냥이</div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px' }}>ERICA 플랫폼</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', padding: '0 8px', marginBottom: '6px' }}>개인</p>
          {NAV_MAIN.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', marginBottom: '2px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize: '9px', backgroundColor: '#2563eb', color: 'white', padding: '2px 5px', borderRadius: '4px', fontWeight: '700' }}>{item.badge}</span>}
            </button>
          ))}
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', padding: '12px 8px 6px', marginBottom: '6px' }}>설정</p>
          {NAV_SETTINGS.map(item => {
            const isActive = item.path === '/notifications';
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', marginBottom: '2px', background: isActive ? 'rgba(37,99,235,0.28)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                <span style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: isActive ? '700' : '400' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
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
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>알림 설정</h1>
        </div>

        {/* 스크롤 콘텐츠 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>

            {/* 마스터 토글 배너 */}
            <div style={{ background: masterOn ? 'linear-gradient(135deg, #1e3a6e 0%, #2563eb 100%)' : 'linear-gradient(135deg, #374151 0%, #4b5563 100%)', borderRadius: '14px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>전체 알림</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginTop: '3px' }}>
                  {masterOn ? '알림이 활성화되어 있어요.' : '모든 알림이 꺼져 있어요.'}
                </div>
              </div>
              <Toggle enabled={masterOn} onChange={() => setMasterOn(v => !v)} />
            </div>

            {/* 알림 채널 */}
            <SectionCard title="알림 채널" desc="알림을 받을 방법을 선택하세요">
              <ToggleRow icon="🔔" label="푸시 알림" desc="브라우저 푸시 알림으로 즉시 수신" enabled={masterOn && channels.push} onChange={() => toggle(channels, setChannels, 'push')} disabled={!masterOn} />
              <ToggleRow icon="📧" label="이메일 알림" desc="학교 이메일로 요약 발송" enabled={masterOn && channels.email} onChange={() => toggle(channels, setChannels, 'email')} disabled={!masterOn} />
              <ToggleRow icon="📱" label="SMS 알림" desc="중요 공지 문자 수신 (별도 설정 필요)" enabled={masterOn && channels.sms} onChange={() => toggle(channels, setChannels, 'sms')} disabled={!masterOn} />
            </SectionCard>

            {/* 공지 출처 */}
            <SectionCard title="공지 출처별 알림" desc="받고 싶은 공지 출처를 선택하세요">
              <ToggleRow icon="🖥️" label="LMS" desc="수업·과제·성적 관련 공지" enabled={masterOn && sources.lms} onChange={() => toggle(sources, setSources, 'lms')} disabled={!masterOn} />
              <ToggleRow icon="🎓" label="장학 공지" desc="장학금 신청·선발 안내" enabled={masterOn && sources.scholarship} onChange={() => toggle(sources, setSources, 'scholarship')} disabled={!masterOn} />
              <ToggleRow icon="🏫" label="학생처·포털" desc="학교 전반 공지사항" enabled={masterOn && sources.portal} onChange={() => toggle(sources, setSources, 'portal')} disabled={!masterOn} />
              <ToggleRow icon="📡" label="ERICA 공지" desc="ERICA 캠퍼스 전용 공지" enabled={masterOn && sources.erica} onChange={() => toggle(sources, setSources, 'erica')} disabled={!masterOn} />
              <ToggleRow icon="💼" label="채용·공모전" desc="인턴십·채용·공모전 정보" enabled={masterOn && sources.career} onChange={() => toggle(sources, setSources, 'career')} disabled={!masterOn} />
            </SectionCard>

            {/* 알림 조건 */}
            <SectionCard title="알림 조건">
              <ToggleRow icon="🏷️" label="키워드 매칭 알림" desc="등록한 키워드가 포함된 공지 수신" enabled={masterOn && keyword} onChange={() => setKeyword(v => !v)} disabled={!masterOn} />
              <div style={{ paddingTop: '4px' }}>
                <ToggleRow icon="⏰" label="마감 임박 알림" desc="공고 마감 3일 전 자동 알림" enabled={masterOn && deadline} onChange={() => setDeadline(v => !v)} disabled={!masterOn} />
              </div>
            </SectionCard>

            {/* 발송 주기 */}
            <SectionCard title="알림 발송 주기" desc="공지 확인 및 발송 주기를 설정하세요">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['즉시', '1시간마다', '하루 1회', '주 1회'].map(opt => (
                  <button key={opt} onClick={() => masterOn && setCycle(opt)}
                    style={{ padding: '9px 18px', borderRadius: '10px', border: '1.5px solid', borderColor: cycle === opt && masterOn ? '#2563eb' : '#e5e7eb', backgroundColor: cycle === opt && masterOn ? '#eff6ff' : 'white', color: cycle === opt && masterOn ? '#2563eb' : '#6b7280', fontWeight: cycle === opt ? '700' : '400', fontSize: '14px', cursor: masterOn ? 'pointer' : 'not-allowed', opacity: masterOn ? 1 : 0.5 }}>
                    {opt}
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* 방해금지 시간 */}
            <SectionCard title="방해 금지 시간" desc="이 시간대에는 알림을 보내지 않아요">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>방해 금지 모드</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>설정 시간 동안 알림 차단</div>
                </div>
                <Toggle enabled={masterOn && quietHour} onChange={() => setQuietHour(v => !v)} disabled={!masterOn} />
              </div>
              {quietHour && masterOn && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280' }}>시작</label>
                    <input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)}
                      style={{ border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', fontSize: '14px', fontWeight: '600', color: '#111827', outline: 'none', backgroundColor: 'white' }} />
                  </div>
                  <span style={{ color: '#9ca3af', fontSize: '18px', marginTop: '18px' }}>~</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280' }}>종료</label>
                    <input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)}
                      style={{ border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', fontSize: '14px', fontWeight: '600', color: '#111827', outline: 'none', backgroundColor: 'white' }} />
                  </div>
                  <div style={{ marginTop: '18px', fontSize: '13px', color: '#6b7280' }}>
                    매일 <strong style={{ color: '#111827' }}>{quietStart}</strong> – <strong style={{ color: '#111827' }}>{quietEnd}</strong>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* 저장 버튼 */}
            <button
              style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563eb')}>
              ✓ 설정 저장
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
