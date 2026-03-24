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

const Keyword: React.FC = () => {
  const navigate = useNavigate();

  const [keywords, setKeywords] = useState([
    '다자녀장학금', '스마트융합공학부', '가을축제', '기숙사', '봉사활동', '키워드',
  ]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = search.trim()
    ? keywords.filter(k => k.toLowerCase().includes(search.toLowerCase()))
    : keywords;

  const confirmAdd = () => {
    if (!newKeyword.trim()) return;
    setKeywords(prev => [...prev, newKeyword.trim()]);
    setNewKeyword('');
    setIsAdding(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setKeywords(prev => prev.filter(k => k !== deleteTarget));
    setDeleteTarget(null);
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
          {NAV_MAIN.map(item => {
            const isActive = item.path === '/keyword';
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
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0, marginRight: 'auto' }}>키워드 관리</h1>

        </div>

        {/* 스크롤 콘텐츠 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

          {/* 안내 카드 */}
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1d4ed8' }}>키워드 기반 공지 알림</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#3b82f6' }}>등록한 키워드가 포함된 공지사항을 자동으로 수집해 알려드립니다.</p>
            </div>
          </div>

          {/* 검색 + 추가 버튼 한 줄 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="키워드 검색..."
                style={{ width: '100%', paddingLeft: '38px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#111827', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <button
              onClick={() => setIsAdding(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              키워드 추가
            </button>
          </div>
          {/* 키워드 카운트 */}
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '14px' }}>총 <strong style={{ color: '#111827' }}>{keywords.length}</strong>개의 키워드</p>

          {/* 키워드 목록 */}
          <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '15px' }}>
                {search ? '검색 결과가 없습니다.' : '등록된 키워드가 없습니다.'}
              </div>
            ) : (
              filtered.map((kw, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: idx < filtered.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb', flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>{kw}</span>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(kw)}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '7px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── 삭제 확인 모달 ── */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '360px', margin: '0 16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>키워드 삭제</h3>
            <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 28px' }}>
              <strong style={{ color: '#111827' }}>"{deleteTarget}"</strong> 키워드를<br />삭제하시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, padding: '12px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                취소
              </button>
              <button onClick={confirmDelete}
                style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 키워드 추가 모달 ── */}
      {isAdding && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '380px', margin: '0 16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 20px' }}>키워드 추가</h3>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>키워드</label>
            <input
              autoFocus
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmAdd()}
              placeholder="추가할 키워드를 입력하세요"
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', color: '#111827', outline: 'none', boxSizing: 'border-box', marginBottom: '24px' }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setIsAdding(false); setNewKeyword(''); }}
                style={{ flex: 1, padding: '12px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                취소
              </button>
              <button onClick={confirmAdd}
                style={{ flex: 1, padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Keyword;
