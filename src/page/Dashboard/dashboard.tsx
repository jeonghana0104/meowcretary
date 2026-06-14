import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png'; 
import { getHanyangNotice, syncExternalApps, logout, getKeywords, type Keyword } from '../../api/api';

interface AppItem {
  name: string;
  sub: string;
  icon: string;
  enabled: boolean;
}

const INITIAL_APPS: AppItem[] = [
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

const CATEGORY_STYLES: { [key: string]: { bg: string; color: string } } = {
  '장학': { bg: '#fef2f2', color: '#dc2626' },      
  '취업/채용': { bg: '#eff6ff', color: '#1d4ed8' },  
  '학사': { bg: '#f0fdf4', color: '#16a34a' },      
  '공모전': { bg: '#fff7ed', color: '#ea580c' },    
  '일반': { bg: '#f3f4f6', color: '#4b5563' },      
};

const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button onClick={onChange} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: enabled ? '#2563eb' : '#d1d5db', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s', flexShrink: 0 }}>
    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: enabled ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
  </button>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [notices, setNotices] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'urgent'>('all');
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<number[]>([]);

  const fetchNotices = () => {
    setLoading(true);
    getHanyangNotice().then((res) => {
      if (res && res.success) {
        const mappedNotices = res.data.map((item: any) => ({
          id: item.id,
          source: 'ERICA', 
          sourceColor: '#0891b2',
          sourceBg: '#ecfeff',
          title: item.title,
          dept: item.category || '일반', 
          time: item.date, 
          deadline: item.deadline || '',
          dday: item.dday !== undefined ? item.dday : null, 
          unread: true,
          link: item.link
        }));
        setNotices(mappedNotices);
        setSelectedNoticeIds([]); 
      } else {
        setNotices([]);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      setNotices([]);
    });
  };

  useEffect(() => {
    fetchNotices();
    // 내 키워드 API(Express /api/keywords)에서 등록 키워드 로드
    getKeywords().then(setKeywords).catch(() => {});
  }, []);

  const toggleApp = (i: number) => {
    setApps(prev => prev.map((app, idx) => idx === i ? { ...app, enabled: !app.enabled } : app));
  };

  const urgentCount = notices.filter(n => n.dday !== null && n.dday >= 0 && n.dday <= 3).length;

  const filteredNotices = notices
    .filter(n => !search || n.title.includes(search))
    .filter(n => {
      if (filterType === 'urgent') {
        return n.dday !== null && n.dday >= 0 && n.dday <= 3;
      }
      return true;
    });

  const handleSelectAll = () => {
    if (selectedNoticeIds.length === filteredNotices.length) {
      setSelectedNoticeIds([]);
    } else {
      setSelectedNoticeIds(filteredNotices.map(n => n.id));
    }
  };

  const handleSyncApps = () => {
  // 1. 사용자가 체크박스로 선택한 공지들의 진짜 데이터만 필터링
  const selectedNotices = notices.filter(n => selectedNoticeIds.includes(n.id));
  
  if (selectedNotices.length === 0) return;

  // 2. 파이썬 백엔드의 NoticeSyncRequest(BaseModel) 규격과 똑같이 데이터 포맷팅
  const requestData = selectedNotices.map(n => ({
    title: n.title,
    category: n.dept, // 리액트의 n.dept가 백엔드의 category로 들어감
    date: n.time,     // 리액트의 n.time이 백엔드의 date로 들어감
    link: n.link,
    deadline: n.deadline || null // 마감일이 없으면 null 처리
  }));

  setLoading(true); // 통신 중 로딩 가동

  // 3. 🚀 2단계에서 만든 함수로 파이썬 서버에 데이터 슛!
  syncExternalApps(requestData)
    .then((res) => {
      if (res.success) {
        // 백엔드가 성공(True)을 반환하면 알림창 띄우기
        alert(
          `🎉 비서냥이 외부앱 연동 성공!\n\n` +
          `📅 구글 캘린더 매핑: ${res.detail.google_calendar.length}건\n` +
          `🗒️ 서버 메모장 저장: ${res.detail.notepad.length}건\n\n` +
          `파이썬 백엔드 폴더에서 [meowcretary_memo.txt]를 확인하세요! 🐾`
        );
        setSelectedNoticeIds([]); // 성공했으므로 체크박스 선택 초기화
      } else {
        alert("외부앱 연동 중 에러가 발생했습니다.");
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error("통신 에러 내용:", err);
      alert("백엔드 서버 연동 통신에 실패했습니다. 서버가 켜져 있는지 확인해 주세요.");
      setLoading(false);
    });
};

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

        <div style={{ padding: '14px 14px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>조</div>
            <div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>조에인</div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px' }}>스마트융합공학부</div>
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
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0, marginRight: 'auto' }}>대시보드</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f3f4f6', borderRadius: '10px', padding: '8px 14px', width: '260px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="공지 검색..." style={{ border: 'none', background: 'none', outline: 'none', fontSize: '14px', color: '#374151', width: '100%' }} />
          </div>
          <button style={iconBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21 a2 2 0 0 1-3.46 0"/></svg>
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
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                  {loading ? "공지사항을 동기화하는 중이에요...🐾" : `현재 한양대 ERICA 최신 공지 ${notices.length}건이 동기화되었습니다.`}
                </div>
              </div>
            </div>
            <button onClick={fetchNotices} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '9px 14px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              🔄 새로고침
            </button>
          </div>

          {/* 통계 카드 4개 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { id: 'all', icon: '📬', value: loading ? '...' : String(notices.length), label: '오늘 수집된 공지', badge: '전체보기', badgeColor: '#16a34a', badgeBg: '#f0fdf4' },
              { id: 'keyword', icon: '🏷️', value: String(keywords.length), label: '등록된 키워드', badge: '활성', badgeColor: '#ea580c', badgeBg: '#fff7ed', path: '/keyword' },
              { id: 'apps', icon: '🔗', value: String(apps.filter(a => a.enabled).length), label: '연동된 앱', badge: '연동 중', badgeColor: '#2563eb', badgeBg: '#eff6ff' },
              { id: 'urgent', icon: '⭐', value: loading ? '...' : String(urgentCount), label: '마감 임박 공고', badge: 'D-3 이내', badgeColor: '#dc2626', badgeBg: '#fef2f2' },
            ].map(card => {
              const isSelected = (card.id === 'all' && filterType === 'all') || (card.id === 'urgent' && filterType === 'urgent');

              return (
                <div key={card.label} 
                  onClick={() => {
                    if (card.path) navigate(card.path);
                    else if (card.id === 'all') setFilterType('all');
                    else if (card.id === 'urgent') setFilterType('urgent');
                  }} 
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '14px', 
                    padding: '18px 20px', 
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb', 
                    cursor: 'pointer', 
                    transition: 'box-shadow 0.15s, border-color 0.15s' 
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '22px' }}>{card.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: card.badgeColor, backgroundColor: card.badgeBg, padding: '3px 8px', borderRadius: '20px' }}>{card.badge}</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{card.label}</div>
                </div>
              );
            })}
          </div>

          {/* 하단 2열 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>

            {/* 공지사항 목록 */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px', color: '#111827' }}>
                    {filterType === 'urgent' ? '🔥 마감 임박 공지 (D-3)' : '📢 최신 공지사항'}
                  </span>
                  {filterType === 'urgent' && (
                    <button onClick={() => setFilterType('all')} style={{ background: '#f3f4f6', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', color: '#4b5563', cursor: 'pointer' }}>필터 해제</button>
                  )}
                </div>
                
                {/* 🌟 버튼 명칭을 '외부앱 연동하기'로 수정 완료 */}
                {selectedNoticeIds.length > 0 ? (
                  <button onClick={handleSyncApps} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>
                    🚀 선택한 {selectedNoticeIds.length}건 외부앱 연동하기
                  </button>
                ) : (
                  <button onClick={() => navigate('/notices')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>전체 보기 →</button>
                )}
              </div>

              {/* 테이블 헤더 */}
              {!loading && filteredNotices.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '40px 90px 100px 1fr 80px', gap: '12px', padding: '10px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontSize: '12px', fontWeight: '700', color: '#6b7280', textAlign: 'left', alignItems: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <input type="checkbox" checked={selectedNoticeIds.length === filteredNotices.length} onChange={handleSelectAll} style={{ cursor: 'pointer' }} />
                  </div>
                  <div>등록 날짜</div>
                  <div>정보 분류</div>
                  <div>공지 내용(제목)</div>
                  <div style={{ textAlign: 'right' }}>마감 현황</div>
                </div>
              )}

              <div style={{ flex: 1 }}>
                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>비서냥이가 공지사항 긁어오는 중...🐱</div>
                ) : filteredNotices.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>조건에 맞는 수집된 공지사항이 없습니다.</div>
                ) : (
                  filteredNotices.map((n, i) => {
                    const catStyle = CATEGORY_STYLES[n.dept] || CATEGORY_STYLES['일반'];
                    const isChecked = selectedNoticeIds.includes(n.id);

                    return (
                      <div key={n.id} 
                        onClick={() => window.open(n.link, '_blank')} 
                        style={{ display: 'grid', gridTemplateColumns: '40px 90px 100px 1fr 80px', gap: '12px', alignItems: 'center', padding: '12px 20px', borderBottom: i < filteredNotices.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'background 0.1s', backgroundColor: isChecked ? '#eff6ff' : 'transparent' }}
                        onMouseEnter={e => { if(!isChecked) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                        onMouseLeave={e => { if(!isChecked) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={isChecked} onChange={() => setSelectedNoticeIds(prev => prev.includes(n.id) ? prev.filter(item => item !== n.id) : [...prev, n.id])} style={{ cursor: 'pointer' }} />
                        </div>

                        <span style={{ fontSize: '13px', color: '#6b7280' }}>{n.time}</span>
                        
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: catStyle.color, backgroundColor: catStyle.bg, padding: '3px 8px', borderRadius: '6px' }}>
                            {n.dept}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: n.unread ? '#2563eb' : 'transparent', flexShrink: 0 }} />
                          <span style={{ fontSize: '14px', color: '#111827', fontWeight: n.unread ? '600' : '400', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {n.title}
                          </span>
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                          {n.dday !== null ? (
                            <span style={{ 
                              fontSize: '11px', 
                              fontWeight: '800', 
                              color: n.dday <= 3 ? '#dc2626' : '#ea580c', 
                              backgroundColor: n.dday <= 3 ? '#fef2f2' : '#fff7ed',
                              padding: '3px 6px', 
                              borderRadius: '4px'
                            }}>
                              {n.dday === 0 ? 'D-Day' : `D-${n.dday}`}
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#d1d5db' }}>-</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
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
                  {keywords.length === 0 ? (
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>등록된 키워드가 없습니다. 추가해보세요!</span>
                  ) : keywords.map(kw => (
                    <span key={kw.id} style={{ fontSize: '12px', color: '#374151', backgroundColor: '#f3f4f6', padding: '5px 11px', borderRadius: '20px' }}>
                      {kw.keyword}
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
                  {apps.map((app, i) => (
                    <div key={app.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{app.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{app.name}</div>
                        <div style={{ fontSize: '11px', color: app.enabled ? '#16a34a' : '#9ca3af' }}>{app.sub}</div>
                      </div>
                      <Toggle enabled={app.enabled} onChange={() => toggleApp(i)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 학교 정보 연동 완료 */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '18px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>學校 계정 연동</span>
                  <span style={{ fontSize: '9px', backgroundColor: '#2563eb', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>NEW</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ fontSize: '16px' }}>🎓</span>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    <span style={{ fontWeight: '600', color: '#374151' }}>한양대학교 ERICA</span> — 연동 완료!
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