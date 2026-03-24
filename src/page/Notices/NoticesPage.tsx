import React, { useState, useMemo } from 'react';
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

const ALL_NOTICES = [
  { id: 1,  source: 'LMS',  sourceColor: '#2563eb', sourceBg: '#eff6ff',  title: '[공지] 2025-2 기말고사 일정 안내',                     dept: '학사지원팀',  time: '2시간 전',  unread: true,  date: '2025.06.18', content: '2025학년도 2학기 기말고사 일정을 안내드립니다. 시험 기간은 6월 23일(월)~27일(금)이며, 자세한 일정은 LMS를 확인해 주세요.' },
  { id: 2,  source: '장학',  sourceColor: '#16a34a', sourceBg: '#f0fdf4',  title: '2025년 2학기 국가장학금 2차 신청 안내',                  dept: '장학복지팀',  time: '5시간 전',  unread: true,  date: '2025.06.18', content: '2025년 2학기 국가장학금 2차 신청 기간은 6월 30일까지입니다. 한국장학재단 홈페이지에서 신청하세요.' },
  { id: 3,  source: '포털',  sourceColor: '#7c3aed', sourceBg: '#fdf4ff',  title: '소프트웨어학부 채용 연계 프로그램 모집',                   dept: '산학협력단',  time: '어제',      unread: false, date: '2025.06.17', content: '소프트웨어학부 재학생을 대상으로 하는 채용 연계 프로그램을 모집합니다. 참여 희망 학생은 산학협력단으로 문의해주세요.' },
  { id: 4,  source: 'ERICA', sourceColor: '#0891b2', sourceBg: '#ecfeff',  title: '도서관 특별 연장 운영 안내 (기말고사 기간)',                dept: '도서관',      time: '어제',      unread: false, date: '2025.06.17', content: '기말고사 기간 동안 도서관 운영시간을 연장합니다. 6월 23일~27일 오전 7시~자정까지 운영합니다.' },
  { id: 5,  source: '포털',  sourceColor: '#7c3aed', sourceBg: '#fdf4ff',  title: '2026년 1학기 수강신청 일정 및 유의사항',                  dept: '학사지원팀',  time: '3일 전',    unread: false, date: '2025.06.15', content: '2026학년도 1학기 수강신청이 8월 중 진행될 예정입니다. 상세 일정은 추후 공지 예정입니다.' },
  { id: 6,  source: '장학',  sourceColor: '#16a34a', sourceBg: '#f0fdf4',  title: '교내 성적 우수 장학금 신청 안내 (2학기)',                  dept: '장학복지팀',  time: '4일 전',    unread: false, date: '2025.06.14', content: '2025학년도 2학기 성적 우수 장학금 신청을 받습니다. 신청 기간은 7월 1일~15일입니다.' },
  { id: 7,  source: 'LMS',  sourceColor: '#2563eb', sourceBg: '#eff6ff',  title: '[안내] 팀프로젝트 제출 마감 D-3',                         dept: '컴퓨터학부',  time: '4일 전',    unread: false, date: '2025.06.14', content: '팀프로젝트 최종 제출 마감일은 6월 21일 오후 11시 59분입니다. LMS에 업로드해주세요.' },
  { id: 8,  source: 'ERICA', sourceColor: '#0891b2', sourceBg: '#ecfeff',  title: '2025 ERICA 캠퍼스 축제 자원봉사자 모집',                  dept: '학생처',      time: '5일 전',    unread: false, date: '2025.06.13', content: '2025 ERICA 캠퍼스 축제 운영을 위한 자원봉사자를 모집합니다. 학생처 홈페이지에서 신청하세요.' },
  { id: 9,  source: '포털',  sourceColor: '#7c3aed', sourceBg: '#fdf4ff',  title: '기숙사 2학기 신청 일정 공고',                             dept: '생활관',      time: '6일 전',    unread: false, date: '2025.06.12', content: '2025학년도 2학기 기숙사 입사 신청을 안내드립니다. 신청 기간 및 선발 방법은 생활관 홈페이지를 참고해주세요.' },
  { id: 10, source: '장학',  sourceColor: '#16a34a', sourceBg: '#f0fdf4',  title: '다자녀 가정 특별 장학금 모집 공고',                       dept: '장학복지팀',  time: '1주일 전',  unread: false, date: '2025.06.11', content: '다자녀 가정 학생을 대상으로 한 특별 장학금 모집 공고입니다. 장학복지팀으로 서류 제출 바랍니다.' },
  { id: 11, source: 'LMS',  sourceColor: '#2563eb', sourceBg: '#eff6ff',  title: '강의 평가 실시 안내 (6/16~6/22)',                        dept: '교학처',      time: '1주일 전',  unread: false, date: '2025.06.11', content: '2025학년도 2학기 강의 평가가 6월 16일부터 22일까지 실시됩니다. LMS에서 참여해주세요.' },
  { id: 12, source: 'ERICA', sourceColor: '#0891b2', sourceBg: '#ecfeff',  title: '[긴급] 캠퍼스 내 주차 시스템 점검 안내',                  dept: '시설팀',      time: '1주일 전',  unread: false, date: '2025.06.10', content: '6월 20일(금) 오전 9시~12시 주차 관리 시스템 점검으로 인해 입출차가 일시 제한됩니다.' },
];

const SOURCES = ['전체', 'LMS', '장학', '포털', 'ERICA'];

type Notice = typeof ALL_NOTICES[0];

const NoticesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeSource, setActiveSource] = useState('전체');
  const [showUnread, setShowUnread] = useState(false);
  const [selected, setSelected] = useState<Notice | null>(null);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    return ALL_NOTICES.filter(n => {
      const matchSource = activeSource === '전체' || n.source === activeSource;
      const matchSearch = !search.trim() || n.title.includes(search) || n.dept.includes(search);
      const matchUnread = !showUnread || (n.unread && !readIds.has(n.id));
      return matchSource && matchSearch && matchUnread;
    });
  }, [search, activeSource, showUnread, readIds]);

  const unreadCount = ALL_NOTICES.filter(n => n.unread && !readIds.has(n.id)).length;

  const openNotice = (n: Notice) => {
    setSelected(n);
    setReadIds(prev => new Set(prev).add(n.id));
  };

  const isUnread = (n: Notice) => n.unread && !readIds.has(n.id);

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
          {NAV_MAIN.map(item => {
            const isActive = item.path === '/notices';
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', marginBottom: '2px', background: isActive ? 'rgba(37,99,235,0.28)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                <span style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: isActive ? '700' : '400', flex: 1 }}>{item.label}</span>
                {item.badge && <span style={{ fontSize: '9px', backgroundColor: '#2563eb', color: 'white', padding: '2px 5px', borderRadius: '4px', fontWeight: '700' }}>{item.badge}</span>}
              </button>
            );
          })}
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', padding: '12px 8px 6px', marginBottom: '6px' }}>설정</p>
          {NAV_SETTINGS.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', marginBottom: '2px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{item.label}</span>
            </button>
          ))}
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
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0, marginRight: 'auto' }}>공지·정보</h1>
          {unreadCount > 0 && (
            <span style={{ fontSize: '12px', fontWeight: '700', backgroundColor: '#ef4444', color: 'white', padding: '3px 9px', borderRadius: '20px' }}>
              읽지 않음 {unreadCount}
            </span>
          )}
          {/* 검색 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f3f4f6', borderRadius: '10px', padding: '8px 14px', width: '240px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="공지 검색..." style={{ border: 'none', background: 'none', outline: 'none', fontSize: '14px', color: '#374151', width: '100%' }} />
          </div>
        </div>

        {/* 필터 바 */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #f3f4f6', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {SOURCES.map(src => (
            <button key={src} onClick={() => setActiveSource(src)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: '1.5px solid', borderColor: activeSource === src ? '#2563eb' : '#e5e7eb', backgroundColor: activeSource === src ? '#eff6ff' : 'white', color: activeSource === src ? '#2563eb' : '#6b7280', fontSize: '13px', fontWeight: activeSource === src ? '700' : '400', cursor: 'pointer', transition: 'all 0.15s' }}>
              {src}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: '#6b7280', userSelect: 'none' }}>
              <input type="checkbox" checked={showUnread} onChange={e => setShowUnread(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer' }} />
              읽지 않은 것만
            </label>
            <span style={{ color: '#d1d5db' }}>|</span>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>총 {filtered.length}건</span>
          </div>
        </div>

        {/* 콘텐츠 2열 (목록 + 상세) */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

          {/* 공지 목록 */}
          <div style={{ width: selected ? '420px' : '100%', flexShrink: 0, height: '100%', overflowY: 'auto', borderRight: selected ? '1px solid #e5e7eb' : 'none', transition: 'width 0.2s' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <p style={{ fontSize: '15px' }}>검색 결과가 없습니다.</p>
              </div>
            ) : (
              filtered.map((n, i) => (
                <div key={n.id} onClick={() => openNotice(n)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px 24px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', backgroundColor: selected?.id === n.id ? '#f0f9ff' : 'white', transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (selected?.id !== n.id) e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                  onMouseLeave={e => { if (selected?.id !== n.id) e.currentTarget.style.backgroundColor = 'white'; }}>

                  {/* 읽음 닷 */}
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isUnread(n) ? '#2563eb' : 'transparent', border: isUnread(n) ? 'none' : '1px solid #e5e7eb', flexShrink: 0, marginTop: '6px' }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: n.sourceColor, backgroundColor: n.sourceBg, padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>{n.source}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0 }}>{n.dept}</span>
                      <span style={{ fontSize: '11px', color: '#d1d5db', marginLeft: 'auto', flexShrink: 0 }}>{n.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: isUnread(n) ? '600' : '400', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</p>
                    {!selected && (
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.content}</p>
                    )}
                  </div>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" style={{ flexShrink: 0, marginTop: '4px' }}><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              ))
            )}
          </div>

          {/* 상세 패널 */}
          {selected && (
            <div style={{ flex: 1, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>

              {/* 상세 헤더 */}
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: selected.sourceColor, backgroundColor: selected.sourceBg, padding: '3px 10px', borderRadius: '20px' }}>{selected.source}</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{selected.dept}</span>
                  <span style={{ fontSize: '12px', color: '#d1d5db', marginLeft: 'auto' }}>{selected.date}</span>
                  <button onClick={() => setSelected(null)}
                    style={{ marginLeft: '8px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '16px', flexShrink: 0 }}>
                    ×
                  </button>
                </div>
                <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: 0, lineHeight: 1.5 }}>{selected.title}</h2>
              </div>

              {/* 본문 */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.8, margin: 0 }}>{selected.content}</p>

                <div style={{ marginTop: '32px', padding: '16px 20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>📌 원문 확인은 학교 포털 또는 LMS에서 가능합니다.</p>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div style={{ padding: '16px 28px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '10px', flexShrink: 0 }}>
                <button style={{ flex: 1, padding: '10px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => {
                    const idx = filtered.findIndex(n => n.id === selected.id);
                    if (idx > 0) openNotice(filtered[idx - 1]);
                  }}>
                  ← 이전
                </button>
                <button style={{ flex: 1, padding: '10px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => {
                    const idx = filtered.findIndex(n => n.id === selected.id);
                    if (idx < filtered.length - 1) openNotice(filtered[idx + 1]);
                  }}>
                  다음 →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
