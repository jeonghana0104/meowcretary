import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ 여기를 대문자(MobileLayout)로 바꿨습니다!
import MobileLayout from '@/components/layout/MobileLayout';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

const Signup: React.FC = () => {
  const navigate = useNavigate();
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
    navigate('/login');
  };

  return (
    <MobileLayout title="회원가입" showBackBtn={true}>
      <div className="px-6 py-6 space-y-5">
        <InputField label="이름" placeholder="이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} />
        <InputField label="학번" placeholder="학번을 입력하세요" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <InputField label="비밀번호" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        <InputField label="비밀번호 확인" type="password" placeholder="비밀번호 재확인" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
        <InputField label="이메일" type="email" placeholder="학교 이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        
        <div className="pt-4">
          <Button text="가입하기" onClick={handleSignup} />
        </div>
      </div>
    </MobileLayout>
  );
};

export default Signup;