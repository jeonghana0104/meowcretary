import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('로그인 시도:', { studentId, password });
    navigate('/dashboard');
  };

  return (
    <MobileLayout title="로그인">
      <div className="px-6 py-8 flex flex-col h-full justify-center">
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">환영합니다! 👋</h2>
          <p className="text-gray-500 text-sm">학교 생활의 모든 정보, 비서냥이와 함께하세요.</p>
        </div>

        <div className="space-y-4">
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
        </div>

        <div className="mt-8">
          <Button text="로그인" onClick={handleLogin} />
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/signup')} 
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
          >
            아직 계정이 없으신가요? <span className="font-bold underline">회원가입</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Login;