import { Routes, Route, Navigate } from 'react-router-dom'
import Keyword from './page/Keyword/keyword'
import MemberInfoSetting from './page/Setting/setting'
import PasswordSetting from './page/Setting/PasswordSetting'
import Menu from './page/Menu/Menu'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu" replace />} />

      <Route path="/menu" element={<Menu />} />
      <Route path="/keyword" element={<Keyword />} />
      <Route path="/member" element={<MemberInfoSetting />} />
      <Route path="/password" element={<PasswordSetting />} />
    </Routes>
  )
}

export default App
