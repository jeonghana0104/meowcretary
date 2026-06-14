import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getToken } from './api/api';

// 친구가 만든 페이지들
import Keyword from './page/Keyword/keyword';
import MemberInfoSetting from './page/Setting/setting';
import PasswordSetting from './page/Setting/PasswordSetting';
import Menu from './page/Menu/Menu';

// 작성자님이 만든 페이지들 (추가됨)
import Login from './page/Login/login';
import Signup from './page/Signup/Signup';
import Dashboard from './page/Dashboard/dashboard';
import MapPage from './page/Map/MapPage';
import NotificationPage from './page/Notification/NotificationPage';
import NoticesPage from './page/Notices/NoticesPage';

import './App.css';

// 로그인 안 된(토큰 없는) 상태로 보호된 페이지 접근 시 로그인으로 보냄
function RequireAuth({ children }: { children: ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      {/* 첫 화면은 로그인 페이지로 설정 */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 공개 페이지 (로그인 불필요) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 보호 페이지 (로그인 필요) */}
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
      <Route path="/notifications" element={<RequireAuth><NotificationPage /></RequireAuth>} />
      <Route path="/notices" element={<RequireAuth><NoticesPage /></RequireAuth>} />
      <Route path="/menu" element={<RequireAuth><Menu /></RequireAuth>} />
      <Route path="/keyword" element={<RequireAuth><Keyword /></RequireAuth>} />
      <Route path="/member" element={<RequireAuth><MemberInfoSetting /></RequireAuth>} />
      <Route path="/password" element={<RequireAuth><PasswordSetting /></RequireAuth>} />
    </Routes>
  );
}

export default App;
