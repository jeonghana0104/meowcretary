import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CatLogo from "../../assets/비서냥이.png";

export default function MemberInfoSetting() {
  const navigate = useNavigate();

  // 테마 상태
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [editable, setEditable] = useState(false);
  const [form, setForm] = useState({
    name: "정하나",
    studentId: "2024000000",
    password: "",
    major: "스마트융합공학부 스마트ICT융합 전공",
    grade: 2,
    email: "jeonghan0104@hanyang.ac.kr",
    phone: "",
    cycle: "1주일",
    notify: true,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 테마 관련 변수
  const isLight = theme === "light";
  const bgStyle = isLight ? 'white' : '#111827'; // gray-900
  const textStyle = isLight ? '#1f2937' : 'white'; // gray-800 vs white
  const borderStyle = isLight ? '#e5e7eb' : '#374151'; // gray-200 vs gray-700
  const inputBgStyle = isLight 
    ? (editable ? 'white' : '#f3f4f6') 
    : (editable ? '#1f2937' : '#374151');

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* 핸드폰 프레임 */}
      <div 
        className={`w-[390px] h-[800px] border-[14px] border-black rounded-[45px] shadow-2xl flex flex-col overflow-hidden relative transition-colors duration-300 ${isLight ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
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
        <header className="px-4 flex flex-col items-center pt-2 pb-3 shrink-0" style={{ padding: '8px 16px 12px', borderBottom: `1px solid ${borderStyle}`, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div className="flex items-center gap-2 mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <img
              src={CatLogo}
              alt="Logo"
              className="w-5 h-5 object-contain"
              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
            />
            <span className="text-lg font-bold" style={{ fontSize: '18px', fontWeight: 'bold' }}>비서냥이</span>
          </div>

          <div
            className="w-full flex items-center py-2.5 px-3 rounded-lg cursor-pointer transition-colors duration-300"
            style={{ width: '100%', backgroundColor: isLight ? '#f3f4f6' : '#1f2937', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate("/menu")}
          >
             <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-5 h-5 mr-3"
              style={{ width: '20px', height: '20px', marginRight: '12px', color: textStyle }}
            >
              <path d="M3 6H21" />
              <path d="M3 12H21" />
              <path d="M3 18H21" />
            </svg>
            <span className="text-base font-semibold" style={{ fontSize: '16px', fontWeight: '600' }}>회원정보 설정</span>
          </div>
        </header>

        {/* 메인 내용 */}
        <main className="flex-1 w-full px-5 py-5 overflow-y-auto scrollbar-hide" style={{ flex: 1, width: '100%', padding: '20px', overflowY: 'auto' }}>
          {[
            { label: "회원명", key: "name" },
            { label: "학번", key: "studentId" },
          ].map((item) => (
            <div className="mb-4" key={item.key} style={{ marginBottom: '16px' }}>
              <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>{item.label}</label>
              <input
                name={item.key}
                type="text"
                value={(form as any)[item.key]}
                onChange={handleChange}
                readOnly={!editable}
                className="w-full border rounded-lg px-3 py-2.5 focus:outline-none"
                style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: inputBgStyle, color: textStyle, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}

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

          <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>학부/전공</label>
            <input
              name="major"
              value={form.major}
              onChange={handleChange}
              readOnly={!editable}
              className="w-full border rounded-lg px-3 py-2.5"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: inputBgStyle, color: textStyle, boxSizing: 'border-box' }}
            />
          </div>

          <div className="mb-4" style={{ marginBottom: '16px' }}>
            <label className="block font-medium mb-1 text-sm opacity-80" style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>학년</label>
            <input
              name="grade"
              type="number"
              value={form.grade}
              onChange={handleChange}
              readOnly={!editable}
              className="w-full border rounded-lg px-3 py-2.5"
              style={{ width: '100%', borderWidth: '1px', borderColor: borderStyle, borderRadius: '8px', padding: '10px 12px', backgroundColor: inputBgStyle, color: textStyle, boxSizing: 'border-box' }}
            />
          </div>

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
              <option>1주일</option>
              <option>2주</option>
              <option>1개월</option>
            </select>
          </div>

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
              <div className={`w-11 h-6 rounded-full transition-colors ${form.notify ? 'bg-[#B783FF]' : 'bg-gray-300'}`} style={{ width: '44px', height: '24px', backgroundColor: form.notify ? '#B783FF' : '#d1d5db', borderRadius: '9999px', transition: 'background-color 0.3s' }} />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform" style={{ position: 'absolute', left: '2px', top: '2px', width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '9999px', transition: 'transform 0.3s', transform: form.notify ? 'translateX(20px)' : 'translateX(0)' }} />
            </label>
          </div>

          <div className="mb-8" style={{ marginBottom: '32px' }}>
            <label className="block font-medium mb-2 text-sm opacity-80" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>테마</label>
            <div className="flex gap-5" style={{ display: 'flex', gap: '20px' }}>
              <label className="flex items-center gap-2 cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                  className="accent-[#B783FF]"
                />
                라이트
              </label>
              <label className="flex items-center gap-2 cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                  className="accent-[#B783FF]"
                />
                다크
              </label>
            </div>
          </div>

          <button
            className="w-full py-3.5 rounded-lg bg-[#B783FF] hover:bg-[#a36ce0] text-white font-bold shadow-md transition-all active:scale-[0.98]"
            style={{ width: '100%', padding: '14px 0', borderRadius: '8px', backgroundColor: '#B783FF', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
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
