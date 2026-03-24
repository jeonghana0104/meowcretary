import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png';

const NOTICES = [
  { id: 1, source: 'LMS', sourceColor: '#2563eb', sourceBg: '#eff6ff', title: '[공지] 2025-2 기말고사 일정 안내', dept: '학사지원팀', time: '2시간 전', unread: true },
  { id: 2, source: '장학', sourceColor: '#16a34a', sourceBg: '#f0fdf4', title: '2025년 2학기 국가장학금 2차 신청 안내', dept: '장학복지팀', time: '5시간 전', unread: true },
  { id: 3, source: '포털', sourceColor: '#7c3aed', sourceBg: '#fdf4ff', title: '소프트웨어학부 채용 연계 프로그램 모집', dept: '산학협력단', time: '어제', unread: false },
  { id: 4, source: 'ERICA', sourceColor: '#0891b2', sourceBg: '#ecfeff', title: '도서관 특별 연장 운영 안내 (기말고사 기간)', dept: '도서관', time: '어제', unread: false },
  { id: 5, source: '포털', sourceColor: '#7c3aed', sourceBg: '#fdf4ff', title: '2026년 1학기 수강신청 일정 및 유의사항', dept: '학사지원팀', time: '3일 전', unread: false },
];

const KEYWORDS = ['장학금', '공모전', '인턴십', '기말고사', 'SW학부', '채용', '도서관'];

const APPS = [
  { name: '구글 캘린더', sub: '일정 자동 등록 중', icon: '📅', enabled: true },
  { name: '노션', sub: '공지 자동 저장 중', icon: '📝', enabled: true },
  { name: '메모장', sub: '미연동', icon: '🗒️', enabled: false },
];

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

const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button onClick={onChange} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: enabled ? '#2563eb' : '#d1d5db', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s', flexShrink: 0 }}>
    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: enabled ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
  </button>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [appStates, setAppStates] = useState(APPS.map(a => a.enabled));
  const [keywords, setKeywords] = useState(KEYWORDS);

  const toggleApp = (i: number) => setAppStates(prev => prev.map((v, idx) => idx === i ? !v : v));

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
          {NAV_MAIN.map(item => {
            const isActive = item.path === '/dashboard';
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 10px', borderRadius: '8px', marginBottom: '2px', background: isActive ? 'rgba(37,99,235,0.28)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                <span style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: isActive ? '700' : '400', flex: 1 }}>{item.label}</span>
                {item.badge && <span style={{ fontSize: '9px', backgroundColor: '#2563eb', color: 'white', padding: '2px 5px', borderRadius: '4px', fontWeight: '700' }}>{item.badge}</span>}
              </button>
            );
          })}

          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', padding: '12px 8px 6px', marginBottom: '6px' }}>설정</p>
          {NAV_SETTINGS.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 10px', borderRadius: '8px', marginBottom: '2px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{item.label}</span>
            </button>
          ))}
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
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0, marginRight: 'auto' }}>대시보드</h1>
          {/* 검색 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f3f4f6', borderRadius: '10px', padding: '8px 14px', width: '260px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="공지 검색..." style={{ border: 'none', background: 'none', outline: 'none', fontSize: '14px', color: '#374151', width: '100%' }} />
          </div>
          {/* 아이콘들 */}
          <button style={iconBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button style={iconBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </button>
        </div>

        {/* 스크롤 콘텐츠 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* 환영 배너 */}
          <div style={{ background: 'linear-gradient(135deg, #0f2044 0%, #1e3a6e 100%)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 6H21"/><path d="M3 12H21"/><path d="M3 18H21"/></svg>
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: '800', fontSize: '17px', marginBottom: '3px' }}>안녕하세요, 조에인 님!</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>오늘 새로운 공지 12건이 수집되었어요. 중요한 정보를 확인해보세요.</div>
              </div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '9px 14px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              🔄 새로고침
            </button>
          </div>

          {/* 통계 카드 4개 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { icon: '📬', value: '47', label: '오늘 수집된 공지', badge: '+12', badgeColor: '#16a34a', badgeBg: '#f0fdf4', path: '/notices' },
              { icon: '🏷️', value: '8', label: '등록된 키워드', badge: '+2', badgeColor: '#ea580c', badgeBg: '#fff7ed', path: '/keyword' },
              { icon: '🔗', value: '3', label: '연동된 앱', badge: '연동 중', badgeColor: '#2563eb', badgeBg: '#eff6ff', path: '/apps' },
              { icon: '⭐', value: '2', label: '마감 임박 공고', badge: 'D-3', badgeColor: '#dc2626', badgeBg: '#fef2f2', path: '/notices' },
            ].map(card => (
              <div key={card.label} onClick={() => navigate(card.path)} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '18px 20px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{card.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: card.badgeColor, backgroundColor: card.badgeBg, padding: '3px 8px', borderRadius: '20px' }}>{card.badge}</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{card.label}</div>
              </div>
            ))}
          </div>

          {/* 하단 2열 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>

            {/* 최신 공지사항 */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '700', fontSize: '15px', color: '#111827' }}>최신 공지사항</span>
                <button onClick={() => navigate('/notices')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>전체 보기 →</button>
              </div>
              <div>
                {NOTICES.filter(n => !search || n.title.includes(search)).map((n, i) => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', borderBottom: i < NOTICES.length - 1 ? '1px solid #f9fafb' : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.unread ? '#2563eb' : 'transparent', border: n.unread ? 'none' : '1px solid #d1d5db', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', fontWeight: '700', color: n.sourceColor, backgroundColor: n.sourceBg, padding: '3px 8px', borderRadius: '20px', flexShrink: 0 }}>{n.source}</span>
                    <span style={{ flex: 1, fontSize: '14px', color: '#111827', fontWeight: n.unread ? '600' : '400', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{n.title}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', flexShrink: 0 }}>{n.dept} · {n.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽 패널 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* 관심 키워드 */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '18px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>관심 키워드</span>
                  <button onClick={() => navigate('/keyword')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>편집 →</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '12px' }}>
                  {keywords.map(kw => (
                    <span key={kw} style={{ fontSize: '12px', color: '#374151', backgroundColor: '#f3f4f6', padding: '5px 11px', borderRadius: '20px', cursor: 'pointer' }}
                      onClick={() => setKeywords(prev => prev.filter(k => k !== kw))}>
                      {kw} ×
                    </span>
                  ))}
                </div>
                <button onClick={() => navigate('/keyword')} style={{ width: '100%', padding: '9px', backgroundColor: '#f8fafc', border: '1.5px dashed #d1d5db', borderRadius: '8px', color: '#6b7280', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                  + 키워드 추가
                </button>
              </div>

              {/* 앱 연동 현황 */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '18px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>앱 연동 현황</span>
                  <button onClick={() => navigate('/apps')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>관리 →</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {APPS.map((app, i) => (
                    <div key={app.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{app.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{app.name}</div>
                        <div style={{ fontSize: '11px', color: appStates[i] ? '#16a34a' : '#9ca3af' }}>{app.sub}</div>
                      </div>
                      <Toggle enabled={appStates[i]} onChange={() => toggleApp(i)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 해린이쪽 */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '18px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>해린이쪽</span>
                  <span style={{ fontSize: '9px', backgroundColor: '#2563eb', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>NEW</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ fontSize: '16px' }}>🎓</span>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    <span style={{ fontWeight: '600', color: '#374151' }}>한양대학교 ERICA</span> — 준비 중
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const iconBtn: React.CSSProperties = { width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default Dashboard;
