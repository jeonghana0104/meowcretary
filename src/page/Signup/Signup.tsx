import React, { useState } from 'react';
// '@'를 사용해 src 폴더부터 경로를 찾습니다.
import type { PageType } from '@/types/index'; 
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

interface SignupProps {
  onPageChange: (page: PageType) => void;
}

const Signup: React.FC<SignupProps> = ({ onPageChange }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log('회원가입 시도:', { name, studentId, password, email });
    alert('회원가입 성공! 로그인 페이지로 이동합니다.');
    onPageChange('login');
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-8 mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">회원가입</h2>
      <InputField
        label="이름"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputField
        label="학번"
        placeholder="학번을 입력하세요"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <InputField
        label="비밀번호"
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputField
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 재확인"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
      <InputField
        label="이메일"
        type="email"
        placeholder="학교 이메일 (@hanyang.ac.kr)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="mt-6">
        <Button text="가입하기" onClick={handleSignup} />
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={() => onPageChange('login')}
          className="text-sm text-purple-600 hover:underline"
        >
          이미 계정이 있으신가요? 로그인
        </button>
      </div>
    </div>
  );
};

export default Signup;