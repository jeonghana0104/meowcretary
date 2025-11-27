import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CatLogo from "../../assets/비서냥이.png";
import { useTheme } from "../../context/ThemeContext"; // 전역 테마 사용

export default function MemberInfoSetting() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme(); // 전역 테마 훅 사용

  const [editable, setEditable] = useState(false);

  const [form, setForm] = useState({
    name: "정하나",
    studentId: "2024000000",
    password: "",
    major: "스마트융합공학부 스마트ICT융합 전공",
    grade: 2,
    email: "jeonghan0104@hanyang.ac.kr",
    phone: "010-0000-0000",
    cycle: "1주일",
    notify: true,
  });

  // 전화번호 자동 하이픈 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // 학번: 최대 10자리
    if (name === "studentId") {
      if (value.length > 10) return;
    }

    // 학년: 1~4 범위 제한
    if (name === "grade") {
      const num = parseInt(value);
      if (value !== "" && (num < 1 || num > 4)) return;
    }

    // 전화번호: 자동 포맷팅
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setForm({ ...form, phone: formatted });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  // 테마 관련 스타일 변수
  const isLight = theme === "light";
  const bgStyle = isLight ? 'white' : '#111827';
  const textStyle = isLight ? '#374151' : 'white';
  const borderStyle = isLight ? '#e5e7eb' : '#374151';
  const inputBgStyle = isLight 
    ? (editable ? 'white' : '#f3f4f6') 
    : (editable ? '#374151' : '#374151');
  
  // 헤더 배경색 (라이트모드: 연한 하늘색, 다크모드: 어두운 회색)
  const headerBgStyle = isLight ? '#2E63A6' : '#374151'; 

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <div 
        className={`w-[390px] h-[800px] border-[14px] border-black rounded-[45px] shadow-2xl flex flex-col overflow-hidden relative transition-colors duration-300`}
        style={{
            width: '390px',
            height: '800px',
            backgroundColor: bgStyle,
            color: textStyle,
            border: '14px solid black',
            borderRadius: '45px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.3s, color 0.3s'
        }}
      >
        {/* 상단 상태바 */}
        <div className="w-full h-6 shrink-0 transition-colors duration-300" style={{ height: '24px', flexShrink: 0, backgroundColor: bgStyle }} />

        {/* 헤더 */}
        <header
  className="px-4 flex flex-col items-center border-b shrink-0"
  style={{
    padding: "0 16px",
    borderBottom: `1px solid ${borderStyle}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  }}
>
  {/* 로고 */}
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

  {/* 통일된 헤더 바 */}
  <div
    style={{
      width: "100%",
      backgroundColor: isLight ? "#2E63A6" : "#374151",
      padding: "10px 6px",
      marginBottom: "8px",
      borderRadius: "4px",
      position: "relative",
      textAlign: "center",
    }}
  >
    <button
      onClick={() => navigate("/menu")}
      style={{
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "white",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke= "white"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M3 6H21" />
        <path d="M3 12H21" />
        <path d="M3 18H21" />
      </svg>
    </button>

    <span
      style={{
        fontSize: "18px",
        fontWeight: 600,
        color: "white",
      }}
    >
      회원정보 설정
    </span>
  </div>
</header>


        {/* 메인 내용 */}
        <main className="flex-1 w-full px-5 py-5 overflow-y-auto scrollbar-hide" style={{ flex: 1, width: '100%', padding: '20px', overflowY: 'auto' }}>
          
          {/* 회원명 (수정 가능) */}
          <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>회원명</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              readOnly={!editable}
              className="w-full border rounded-lg px-3 py-2.5 focus:outline-none"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: inputBgStyle, color: textStyle, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* 학번 (수정 불가 - readonly 고정) */}
          <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>학번</label>
            <input
              name="studentId"
              type="text"
              maxLength={10}
              value={form.studentId}
              onChange={handleChange}
              readOnly={true} // 항상 읽기 전용
              className="w-full border rounded-lg px-3 py-2.5"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: isLight ? '#f3f4f6' : '#374151', color: textStyle, boxSizing: 'border-box', opacity: 0.7 }}
            />
          </div>

          {/* 비밀번호 (페이지 이동) */}
          <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>비밀번호</label>
            <input
              type="password"
              readOnly
              onClick={() => navigate("/password")}
              className="w-full border rounded-lg px-3 py-2.5 cursor-pointer"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: isLight ? '#f3f4f6' : '#1f2937', color: textStyle, cursor: 'pointer', boxSizing: 'border-box' }}
              placeholder="비밀번호 변경하기"
            />
          </div>

          {/* 학부/전공 (수정 불가 - readonly 고정) */}
          <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>학부/전공</label>
            <input
              name="major"
              value={form.major}
              readOnly={true} // 항상 읽기 전용
              className="w-full border rounded-lg px-3 py-2.5"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: isLight ? '#f3f4f6' : '#374151', color: textStyle, boxSizing: 'border-box', opacity: 0.7 }}
            />
          </div>

          {/* 학년 (수정 가능, 1~4 제한) */}
          <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>학년</label>
            <input
              name="grade"
              type="number"
              min={1}
              max={4}
              value={form.grade}
              onChange={handleChange}
              readOnly={!editable}
              className="w-full border rounded-lg px-3 py-2.5"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: inputBgStyle, color: textStyle, boxSizing: 'border-box' }}
            />
          </div>

          {/* 이메일 (수정 가능) */}
          <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>이메일</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              readOnly={!editable}
              className="w-full border rounded-lg px-3 py-2.5"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: inputBgStyle, color: textStyle, boxSizing: 'border-box' }}
            />
          </div>

           {/* 전화번호 (수정 가능, 자동 하이픈) */}
           <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>전화번호</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              readOnly={!editable}
              placeholder="010-0000-0000"
              className="w-full border rounded-lg px-3 py-2.5"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: inputBgStyle, color: textStyle, boxSizing: 'border-box' }}
            />
          </div>

          {/* 키워드 주기 (수정 가능) */}
          <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>키워드 자동검색 주기</label>
            <select
              name="cycle"
              disabled={!editable}
              value={form.cycle}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2.5"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: inputBgStyle, color: textStyle, boxSizing: 'border-box' }}
            >
              <option>1일</option>
              <option>1주일</option>
              <option>1개월</option>
            </select>
          </div>

          {/* 알림 설정 (색상 변경: #2E63A6) */}
          <div className="flex items-center mb-6" style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <label className="font-medium mr-3 text-sm opacity-80" style={{ fontWeight: '500', marginRight: '12px', fontSize: '14px', opacity: 0.8 }}>알림설정</label>
            <label className="relative inline-flex items-center cursor-pointer" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                className="sr-only peer"
                style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}
                disabled={!editable}
                checked={form.notify}
                onChange={() => setForm({ ...form, notify: !form.notify })}
              />
              <div className={`w-11 h-6 rounded-full transition-colors`} style={{ width: '44px', height: '24px', backgroundColor: form.notify ? '#2E63A6' : '#d1d5db', borderRadius: '9999px', transition: 'background-color 0.3s' }} />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform" style={{ position: 'absolute', left: '2px', top: '2px', width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '9999px', transition: 'transform 0.3s', transform: form.notify ? 'translateX(20px)' : 'translateX(0)' }} />
            </label>
          </div>

          {/* 테마 설정 (전역 상태 연동) */}
          <div className="mb-8" style={{ marginBottom: '32px' }}>
            <label className="block font-medium mb-2 text-sm opacity-80" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>테마</label>
            <div className="flex gap-5" style={{ display: 'flex', gap: '20px' }}>
              <label className="flex items-center gap-2 cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                  className="accent-[#2E63A6]" // 색상 변경
                />
                라이트
              </label>
              <label className="flex items-center gap-2 cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                  className="accent-[#2E63A6]" // 색상 변경
                />
                다크
              </label>
            </div>
          </div>

          {/* 수정 버튼 (색상 변경: #2E63A6) */}
          <button
            className="w-full py-3.5 rounded-lg text-white font-bold shadow-md transition-all active:scale-[0.98]"
            style={{ width: '100%', padding: '14px 0', borderRadius: '8px', backgroundColor: '#2E63A6', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
            onClick={() => setEditable(!editable)}
          >
            {editable ? "수정 완료" : "수정"}
          </button>
        </main>

        {/* 하단 홈 바 */}
        <div className="w-full h-8 flex justify-center items-start pt-1 shrink-0 transition-colors duration-300" style={{ width: '100%', height: '32px', backgroundColor: bgStyle, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', flexShrink: 0 }}>
          <div className="w-32 h-1.5 bg-gray-300 rounded-full" style={{ width: '128px', height: '6px', backgroundColor: isLight ? '#d1d5db' : '#4b5563', borderRadius: '9999px' }} />
        </div>

      </div>
    </div>
  );
}
