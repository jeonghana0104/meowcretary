import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CatLogo from '../../assets/비서냥이.png';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSignup = () => {
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    setShowSuccess(true);   // 모달 켜기
  };
  

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <div 
        className="w-[390px] h-[800px] bg-white border-[14px] border-black rounded-[45px] shadow-2xl flex flex-col overflow-hidden relative"
        style={{
            width: '390px', height: '800px', backgroundColor: 'white', border: '14px solid black', borderRadius: '45px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column'
        }}
      >
        
        <div className="w-full h-6 bg-white shrink-0" style={{ height: '24px', flexShrink: 0 }}></div>

        {/* 헤더 */}
        <header
          className="px-4 flex flex-col items-center border-b shrink-0"
          style={{
            padding: "0 16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div
            className="flex items-center gap-2 mb-2 mt-2"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              marginTop: "8px",
            }}
          >
            <img
              src={CatLogo}
              className="object-contain"
              style={{
                width: "50px",
                height: "50px",
                marginRight: "10px",
                objectFit: "contain",
              }}
            />
            <span
              className="text-lg font-semibold"
              style={{ fontSize: "18px", fontWeight: "600" }}
            >
              비서냥이
            </span>
          </div>

          <div
            style={{
              width: "100%",
              backgroundColor: "#2E63A6",
              padding: "10px 6px",
              marginBottom: "8px",
              borderRadius: "4px",
              position: "relative",
              textAlign: "center",
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "white",
              }}
            >회원가입</span>
            <div style={{ width: '24px' }}></div> {/* spacer */}
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div className="space-y-5" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <InputField label="이름" placeholder="이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} />
            <InputField label="학번" placeholder="학번을 입력하세요" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            <InputField label="비밀번호" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
            <InputField label="비밀번호 확인" type="password" placeholder="비밀번호 재확인" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
            <InputField label="이메일" type="email" placeholder="학교 이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
            
            <div className="pt-4">
              <Button text="가입하기" onClick={handleSignup} />
            </div>
          </div>
        </div>
        {showSuccess && (
  <div
    className="fixed inset-0 flex justify-center items-center"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: 260,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <p
        className="font-medium mb-6"
        style={{
          fontSize: 16,
          fontWeight: 500,
          marginBottom: 24,
          color: "#1f2937",
        }}
      >
        회원가입이 완료되었습니다.
      </p>

      <button
        onClick={() => navigate("/login")}
        style={{
          width: "100%",
          padding: "10px 0",
          borderRadius: 8,
          backgroundColor: "#2E63A6",
          color: "white",
          fontWeight: 600,
        }}
      >
        확인
      </button>
    </div>
  </div>
)}
 
        <div className="w-full h-8 bg-white flex justify-center items-start pt-1 shrink-0" style={{ width: '100%', height: '32px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', flexShrink: 0 }}>
          <div className="w-32 h-1.5 bg-gray-300 rounded-full" style={{ width: '128px', height: '6px', backgroundColor: '#d1d5db', borderRadius: '9999px' }}></div>
        </div>

      </div>
    </div>
  );
};

export default Signup;