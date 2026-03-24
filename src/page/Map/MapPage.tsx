import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png';

declare global {
  interface Window { kakao: any; }
}

// ── 한양대 ERICA 캠퍼스 좌표 ──
const ERICA_LAT = 37.30089;
const ERICA_LNG = 126.83375;

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

interface Message {
  role: 'user' | 'ai';
  content: string;
  places?: PlaceResult[];
}

interface PlaceResult {
  place_name: string;
  address_name: string;
  phone: string;
  x: string;
  y: string;
  category_name: string;
}

// AI 응답 템플릿
const buildAiResponse = (keyword: string, count: number): string => {
  if (count === 0) return `"${keyword}" 관련 장소를 주변에서 찾지 못했어요 😿\n검색어를 바꿔서 다시 시도해볼까요?`;
  const suffix = count === 1 ? '1곳' : `${count}곳`;
  const emojis: Record<string, string> = {
    빵: '🥐', 베이커리: '🥐', 카페: '☕', 커피: '☕',
    식당: '🍽️', 밥: '🍽️', 편의점: '🏪', 약국: '💊',
    도서관: '📚', 운동: '🏃', 헬스: '💪',
  };
  const emoji = Object.entries(emojis).find(([k]) => keyword.includes(k))?.[1] ?? '📍';
  return `${emoji} **"${keyword}"** 검색 결과를 지도에 표시했어요!\n총 **${suffix}**을 찾았어요. 아래 목록에서 원하는 곳을 클릭하면 지도에서 바로 확인할 수 있어요.`;
};

// 마커 HTML 생성
const makeMarkerHtml = (name: string, idx: number, color: string) => `
  <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer" title="${name}">
    <div style="background:${color};color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${idx + 1}</div>
    <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${color};margin-top:-1px"></div>
    <div style="background:white;border-radius:6px;padding:3px 7px;font-size:11px;font-weight:600;color:#111;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.15);margin-top:2px;max-width:120px;overflow:hidden;text-overflow:ellipsis">${name}</div>
  </div>`;

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const campusOverlayRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'ai',
    content: '안녕하세요! 🐱 한양대 ERICA 캠퍼스 주변 정보를 알려드릴게요.\n\n검색창에 궁금한 장소를 입력하거나, 아래 버튼을 눌러보세요!',
  }]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // ── Kakao Maps 스크립트 로드 ──
  useEffect(() => {
    const appKey = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!appKey || appKey === 'your_key_here') {
      setMapError('VITE_KAKAO_MAP_KEY가 설정되지 않았습니다.\n.env.local 파일에 카카오 앱 키를 입력해주세요.');
      return;
    }

    if (window.kakao?.maps) { setMapLoaded(true); return; }

    const script = document.createElement('script');
    script.id = 'kakao-map-sdk';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => setMapLoaded(true));
    script.onerror = () => setMapError('카카오맵 SDK 로드에 실패했습니다. API 키를 확인해주세요.');
    document.head.appendChild(script);
    return () => { document.getElementById('kakao-map-sdk')?.remove(); };
  }, []);

  // ── 지도 초기화 ──
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;
    const options = {
      center: new window.kakao.maps.LatLng(ERICA_LAT, ERICA_LNG),
      level: 4,
    };
    mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, options);

    // 캠퍼스 기준 마커
    const campusPos = new window.kakao.maps.LatLng(ERICA_LAT, ERICA_LNG);
    const campusHtml = `
      <div style="display:flex;flex-direction:column;align-items:center">
        <div style="background:#1d4ed8;color:white;border-radius:12px;padding:6px 12px;font-weight:700;font-size:13px;box-shadow:0 3px 10px rgba(0,0,0,0.3);border:2px solid white;white-space:nowrap">🏫 한양대 ERICA</div>
        <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid #1d4ed8;margin-top:-1px"></div>
      </div>`;
    campusOverlayRef.current = new window.kakao.maps.CustomOverlay({ position: campusPos, content: campusHtml, yAnchor: 1.3 });
    campusOverlayRef.current.setMap(mapRef.current);
  }, [mapLoaded]);

  // 채팅 스크롤
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── 마커 초기화 ──
  const clearOverlays = useCallback(() => {
    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];
  }, []);

  // ── 장소 검색 & 마커 표시 ──
  const searchAndDisplay = useCallback((keyword: string): Promise<PlaceResult[]> => {
    return new Promise((resolve) => {
      if (!mapRef.current || !window.kakao?.maps?.services) { resolve([]); return; }

      const ps = new window.kakao.maps.services.Places();
      const center = new window.kakao.maps.LatLng(ERICA_LAT, ERICA_LNG);

      ps.keywordSearch(
        keyword,
        (data: PlaceResult[], status: string) => {
          clearOverlays();
          if (status !== window.kakao.maps.services.Status.OK) { resolve([]); return; }

          const results = data.slice(0, 6);
          const bounds = new window.kakao.maps.LatLngBounds();

          results.forEach((place, idx) => {
            const pos = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
            bounds.extend(pos);

            const overlay = new window.kakao.maps.CustomOverlay({
              position: pos,
              content: makeMarkerHtml(place.place_name, idx, '#ef4444'),
              yAnchor: 1,
            });
            overlay.setMap(mapRef.current);
            overlaysRef.current.push(overlay);
          });

          // 캠퍼스 마커도 bounds에 포함
          bounds.extend(new window.kakao.maps.LatLng(ERICA_LAT, ERICA_LNG));
          mapRef.current.setBounds(bounds);
          resolve(results);
        },
        { location: center, radius: 3000, sort: window.kakao.maps.services.SortBy.DISTANCE },
      );
    });
  }, [clearOverlays]);

  // ── 특정 장소로 지도 이동 ──
  const focusPlace = (place: PlaceResult) => {
    if (!mapRef.current) return;
    const pos = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
    mapRef.current.setCenter(pos);
    mapRef.current.setLevel(2);
  };

  // ── 검색창 Enter ──
  const handleSearchSubmit = async (keyword: string) => {
    if (!keyword.trim()) return;
    setChatOpen(true);
    setChatInput('');
    await processMessage(keyword.trim());
    setSearchInput('');
  };

  // ── 채팅 메시지 처리 ──
  const processMessage = useCallback(async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const places = await searchAndDisplay(text);
    const aiMsg = buildAiResponse(text, places.length);

    setMessages(prev => [...prev, { role: 'ai', content: aiMsg, places }]);
    setIsTyping(false);
  }, [searchAndDisplay]);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    processMessage(chatInput.trim());
    setChatInput('');
  };

  const quickSearches = ['근처 빵집', '카페', '학생식당', '편의점', '약국', '버스 정류장'];

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>

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
            const isActive = item.path === '/map';
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

      {/* ── 지도 + 채팅 영역 ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* 지도 컨테이너 */}
        {mapError ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>🗺️</div>
            <div style={{ backgroundColor: 'white', borderRadius: '14px', border: '1px solid #fecaca', padding: '24px 32px', maxWidth: '480px', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626', margin: '0 0 8px' }}>카카오맵 API 키 필요</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px', whiteSpace: 'pre-line' }}>{mapError}</p>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px 16px', textAlign: 'left', fontFamily: 'monospace', fontSize: '13px', color: '#374151' }}>
                <div style={{ color: '#9ca3af', marginBottom: '4px' }}># .env.local 파일 생성 후 입력:</div>
                <div>VITE_KAKAO_MAP_KEY=<span style={{ color: '#2563eb' }}>발급받은_앱키</span></div>
              </div>
              <a href="https://developers.kakao.com" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '14px', padding: '8px 16px', backgroundColor: '#fee500', color: '#111', borderRadius: '8px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
                카카오 개발자센터 →
              </a>
            </div>
          </div>
        ) : (
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        )}

        {/* ── 상단 검색바 (지도 위 float) ── */}
        {!mapError && (
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '420px', maxWidth: 'calc(100% - 48px)' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchSubmit(searchInput)}
                placeholder="장소, 음식, 시설을 검색하세요..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#111827', backgroundColor: 'transparent' }}
              />
              <button
                onClick={() => handleSearchSubmit(searchInput)}
                style={{ padding: '7px 14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                검색
              </button>
            </div>

            {/* 빠른 검색 태그 */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {quickSearches.map(q => (
                <button key={q} onClick={() => handleSearchSubmit(q)}
                  style={{ padding: '5px 12px', backgroundColor: 'rgba(255,255,255,0.92)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '20px', fontSize: '12px', fontWeight: '500', color: '#374151', cursor: 'pointer', backdropFilter: 'blur(4px)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── AI 채팅 토글 버튼 ── */}
        {!mapError && (
          <button
            onClick={() => setChatOpen(o => !o)}
            style={{ position: 'absolute', bottom: '24px', right: chatOpen ? '372px' : '20px', zIndex: 20, width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', transition: 'right 0.3s ease' }}>
            {chatOpen ? '✕' : '🐱'}
          </button>
        )}

        {/* ── AI 채팅 패널 ── */}
        <div style={{
          position: 'absolute', top: 0, right: 0, height: '100%', width: '360px',
          backgroundColor: 'white', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', zIndex: 15,
          transform: chatOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}>

          {/* 채팅 헤더 */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, background: 'linear-gradient(135deg, #1e3a6e 0%, #1d4ed8 100%)' }}>
            <img src={CatLogo} alt="비서냥이" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '15px' }}>비서냥이 지도 AI</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>ERICA 캠퍼스 정보 안내</div>
            </div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 0 2px rgba(74,222,128,0.3)' }} />
          </div>

          {/* 메시지 목록 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.role === 'ai' ? (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🐱</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ backgroundColor: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '4px 14px 14px 14px', padding: '12px 14px', fontSize: '13.5px', color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                        {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                      </div>

                      {/* 장소 카드 */}
                      {msg.places && msg.places.length > 0 && (
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {msg.places.map((place, pi) => (
                            <button key={pi} onClick={() => focusPlace(place)}
                              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                              onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '11px', flexShrink: 0 }}>{pi + 1}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: '600', fontSize: '13px', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.place_name}</div>
                                <div style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>{place.address_name}</div>
                              </div>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ backgroundColor: '#2563eb', color: 'white', borderRadius: '14px 4px 14px 14px', padding: '10px 14px', fontSize: '13.5px', maxWidth: '80%', lineHeight: 1.5 }}>
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🐱</div>
                <div style={{ backgroundColor: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#93c5fd', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* 빠른 질문 */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
            {['근처 빵집', '카페 추천', '편의점'].map(q => (
              <button key={q} onClick={() => { processMessage(q); }}
                style={{ padding: '5px 10px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', fontSize: '12px', color: '#0369a1', fontWeight: '500', cursor: 'pointer' }}>
                {q}
              </button>
            ))}
          </div>

          {/* 입력창 */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px', flexShrink: 0 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleChatSend()}
              placeholder="궁금한 장소를 물어보세요..."
              style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#111827', outline: 'none', backgroundColor: '#fafafa' }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <button onClick={handleChatSend} disabled={!chatInput.trim() || isTyping}
              style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: chatInput.trim() && !isTyping ? '#2563eb' : '#e5e7eb', color: chatInput.trim() && !isTyping ? 'white' : '#9ca3af', border: 'none', cursor: chatInput.trim() && !isTyping ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.15s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* bounce 애니메이션 */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default MapPage;
