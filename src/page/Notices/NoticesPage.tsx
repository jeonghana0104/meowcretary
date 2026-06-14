import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png'; // 🎯 오타 (=) 완벽 교정 완료!
// 🌟 백엔드 API 함수들 (공지사항 및 키워드 목록 가져오기)
import { getHanyangNotice, getUserKeywords } from '../../api/api'; 

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

// 키워드별 이쁜 랜덤 색상 매핑을 위한 헬퍼
const KEYWORD_COLORS = [
  { color: '#2563eb', bg: '#eff6ff' }, // 블루
  { color: '#16a34a', bg: '#f0fdf4' }, // 그린
  { color: '#7c3aed', bg: '#fdf4ff' }, // 퍼플
  { color: '#0891b2', bg: '#ecfeff' }, // 시안
  { color: '#ea580c', bg: '#fff7ed' }, // 오렌지
];

interface Notice {
  id: number;
  keyword: string; // 🌟 소스 대신 매핑된 키워드가 들어감
  sourceColor: string;
  sourceBg: string;
  title: string;
  dept: string;
  date: string;
  unread: boolean;
  content: string;
  link: string;
}

const NoticesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeSource, setActiveSource] = useState('전체'); // 현재 선택된 키워드 탭
  const [showUnread, setShowUnread] = useState(false);
  const [selected, setSelected] = useState<Notice | null>(null);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  
  // 🌟 서버에서 가져올 상단 탭(키워드) 목록 상태
  const [sources, setSources] = useState<string[]>(['전체']);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌟 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. 사용자가 등록한 키워드 목록 가져오기
        const keywordRes = await getUserKeywords();
        let userKeywords: string[] = [];
        if (keywordRes && keywordRes.success) {
          userKeywords = keywordRes.data; 
          setSources(['전체', ...userKeywords]);
        }

        // 2. 크롤링된 전체 공지사항 가져오기
        const noticeRes = await getHanyangNotice();
        if (noticeRes && noticeRes.success) {
          const mapped: Notice[] = [];

          noticeRes.data.forEach((item: any, index: number) => {
            // 🌟 공지사항 제목에 사용자가 등록한 키워드가 포함되어 있는지 매핑 검사
            const matchingKeyword = userKeywords.find(kw => item.title.includes(kw)) || '일반';

            // 키워드에 따른 UI 색상 배정
            const colorIdx = userKeywords.indexOf(matchingKeyword) % KEYWORD_COLORS.length;
            const style = colorIdx >= 0 ? KEYWORD_COLORS[colorIdx] : { color: '#4b5563', bg: '#f3f4f6' };

            mapped.push({
              id: item.id || index,
              keyword: matchingKeyword, // 공지에 매핑된 키워드 저장
              sourceColor: style.color,
              sourceBg: style.bg,
              title: item.title,
              dept: item.category || '공지', 
              date: item.date,
              unread: true,
              content: item.content || `${item.title} 원문 정보입니다. 등록하신 관심 키워드 [${matchingKeyword}] 조건에 부합하여 비서냥이 서비스에 자동으로 분류 수집되었습니다.`,
              link: item.link
            });
          });

          setNotices(mapped);
        }
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🌟 사용자가 선택한 키워드 탭에 맞는 공지만 실시간 필터링
  const filtered = useMemo(() => {
    return notices.filter(n => {
      // 1. 키워드 탭 필터링: '전체'면 패스, 특정 키워드면 매핑된 키워드 공지만!
      const matchSource = activeSource === '전체' || n.keyword === activeSource;
      // 2. 제목 검색 필터링
      const matchSearch = !search.trim() || n.title.includes(search) || n.dept.includes(search);
      // 3. 읽지 않은 공지 필터링
      const matchUnread = !showUnread || (n.unread && !readIds.has(n.id));
      
      return matchSource && matchSearch && matchUnread;
    });
  }, [notices, search, activeSource, showUnread, readIds]);

  const unreadCount = notices.filter(n => n.unread && !readIds.has(n.id)).length;

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
          {!loading && unreadCount > 0 && (
            <span style={{ fontSize: '12px', fontWeight: '700', backgroundColor: '#ef4444', color: 'white', padding: '3px 9px', borderRadius: '20px' }}>
              읽지 않음 {unreadCount}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f3f4f6', borderRadius: '10px', padding: '8px 14px', width: '240px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="공지 검색..." style={{ border: 'none', background: 'none', outline: 'none', fontSize: '14px', color: '#374151', width: '100%' }} />
          </div>
        </div>

        {/* 🌟 동적 키워드 필터 바 */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #f3f4f6', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, overflowX: 'auto' }}>
          {sources.map(src => (
            <button key={src} onClick={() => setActiveSource(src)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: '1.5px solid', borderColor: activeSource === src ? '#2563eb' : '#e5e7eb', backgroundColor: activeSource === src ? '#eff6ff' : 'white', color: activeSource === src ? '#2563eb' : '#6b7280', fontSize: '13px', fontWeight: activeSource === src ? '700' : '400', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
              {src}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: '#6b7280', userSelect: 'none' }}>
              <input type="checkbox" checked={showUnread} onChange={e => setShowUnread(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer' }} />
              읽지 않은 것만
            </label>
            <span style={{ color: '#d1d5db' }}>|</span>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>총 {!loading ? filtered.length : 0}건</span>
          </div>
        </div>

        {/* 콘텐츠 2열 */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* 공지 목록 */}
          <div style={{ width: selected ? '420px' : '100%', flexShrink: 0, height: '100%', overflowY: 'auto', borderRight: selected ? '1px solid #e5e7eb' : 'none', transition: 'width 0.2s' }}>
            {loading ? (
              <div style={{ padding: '80px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                키워드 공지를 분류하고 있어요...🐱
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <p style={{ fontSize: '15px' }}>해당 키워드의 공지가 없습니다.</p>
              </div>
            ) : (
              filtered.map((n) => (
                <div key={n.id} onClick={() => openNotice(n)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px 24px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', backgroundColor: selected?.id === n.id ? '#f0f9ff' : 'white', transition: 'background 0.1s' }}>

                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isUnread(n) ? '#2563eb' : 'transparent', border: isUnread(n) ? 'none' : '1px solid #e5e7eb', flexShrink: 0, marginTop: '6px' }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: n.sourceColor, backgroundColor: n.sourceBg, padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>{n.keyword}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0 }}>{n.dept}</span>
                      <span style={{ fontSize: '11px', color: '#d1d5db', marginLeft: 'auto', flexShrink: 0 }}>{n.date}</span>
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
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: selected.sourceColor, backgroundColor: selected.sourceBg, padding: '3px 10px', borderRadius: '20px' }}>{selected.keyword}</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{selected.dept}</span>
                  <span style={{ fontSize: '12px', color: '#d1d5db', marginLeft: 'auto' }}>{selected.date}</span>
                  <button onClick={() => setSelected(null)}
                    style={{ marginLeft: '8px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '16px', flexShrink: 0 }}>
                    ×
                  </button>
                </div>
                <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: 0, lineHeight: 1.5 }}>{selected.title}</h2>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.8, margin: 0 }}>{selected.content}</p>
                <div style={{ marginTop: '32px', padding: '16px 20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                    📌 원문 링크 바로가기: <a href={selected.link} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'underline' }}>한양대학교 공지 사이트로 이동</a>
                  </p>
                </div>
              </div>

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