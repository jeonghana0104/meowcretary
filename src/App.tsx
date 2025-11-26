import { Routes, Route, Navigate } from 'react-router-dom';

// 친구가 만든 페이지들
import Keyword from './page/Keyword/keyword';
import MemberInfoSetting from './page/Setting/setting';
import PasswordSetting from './page/Setting/PasswordSetting';
import Menu from './page/Menu/Menu';

// 작성자님이 만든 페이지들 (추가됨)
import Login from './page/Login/login';
import Signup from './page/Signup/Signup';
import Dashboard from './page/Dashboard/dashboard';

import './App.css';

function App() {
  return (
    <Routes>
      {/* 첫 화면은 로그인 페이지로 설정 (원하면 menu로 바꿔도 됨) */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 작성자님 페이지 */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 친구 페이지 */}
      <Route path="/menu" element={<Menu />} />
      <Route path="/keyword" element={<Keyword />} />
      <Route path="/member" element={<MemberInfoSetting />} />
      <Route path="/password" element={<PasswordSetting />} />
    </Routes>
  );
}

export default App;