import React, { useState } from 'react';
import type { PageType } from '../../types';
import InputField from '../../components/common/InputField.tsx/index.ts';
import Button from '../../components/common/Button.tsx';

interface LoginProps {
  onPageChange: (page: PageType) => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onPageChange, onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 로직 (나중에 API 연결)
    console.log('로그인 시도:', { studentId, password });
    onLoginSuccess(); // 성공했다고 가정하고 대시보드로 이동
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-8 mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">비서냥이 로그인</h2>
      <InputField
        label="학번"
        placeholder="학번을 입력하세요"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <InputField
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="mt-6">
        <Button text="로그인" onClick={handleLogin} />
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={() => onPageChange('signup')}
          className="text-sm text-purple-600 hover:underline"
        >
          계정이 없으신가요? 회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;