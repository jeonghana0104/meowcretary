import React from 'react';
import CatLogo from '../../assets/비서냥이.png';

const AuthLeftPanel: React.FC = () => (
  <div
    className="hidden md:flex"
    style={{
      width: '42%',
      height: '100vh',
      background: 'linear-gradient(160deg, #0a1628 0%, #0f2044 40%, #0d1b3e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 48px 140px',
      gap: '48px',
      flexShrink: 0,
    }}
  >
    {/* 로고 + 원형 */}
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        position: 'absolute',
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #1e3a6e 0%, #152d5a 60%, transparent 100%)',
        zIndex: 0,
      }} />
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '48px' }}>
        <img
          src={CatLogo}
          alt="비서냥이"
          style={{ width: '150px', height: '150px', objectFit: 'contain', marginBottom: '6px' }}
        />
        <h1 style={{ color: 'white', fontSize: '38px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          비서냥이
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: 0 }}>
          ERICA 맞춤형 정보 자동화 플랫폼
        </p>
      </div>
    </div>

    {/* 기능 목록 */}
    <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {[
        { icon: '📋', text: '공지사항 자동 수집' },
        { icon: '🏷️', text: '키워드 기반 필터링' },
        { icon: '🔗', text: '외부 앱 연동' },
        { icon: '🗺️', text: '캠퍼스 지도' },
      ].map((item) => (
        <div key={item.text} style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px 22px',
        }}>
          <span style={{ fontSize: '22px' }}>{item.icon}</span>
          <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: '16px', fontWeight: '500' }}>{item.text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AuthLeftPanel;
