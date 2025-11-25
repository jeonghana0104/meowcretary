import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CatLogo from "../../assets/비서냥이.png";

export default function MemberInfoSetting() {
  const navigate = useNavigate();

  // 테마 상태
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 입력 가능 여부
  const [editable, setEditable] = useState(false);

  // 기본 값
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

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center ${
        theme === "light" ? "bg-gray-100" : "bg-black text-white"
      }`}
    >
      {/* 핸드폰 프레임 */}
      <div
        className={`w-full max-w-sm min-h-screen border border-gray-300 shadow-xl ${
          theme === "light" ? "bg-white" : "bg-gray-900"
        }`}
      >
        {/* 상단 헤더 */}
        <header className="px-4 flex flex-col items-center border-b border-gray-200 pt-4 pb-3">
          {/* 아이콘 + 비서냥이 */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={CatLogo}
              className="object-contain"
              style={{ width: "20px", height: "20px", marginRight: "6px" }}
            />
            <span className="text-lg font-semibold">비서냥이</span>
          </div>

          {/* 메뉴바 */}
          <div
            className="w-full bg-gray-100 flex items-center py-2 rounded cursor-pointer"
            style={{ paddingLeft: "6px" }}
            onClick={() => navigate("/menu")}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              className="mr-2"
            >
              <path d="M3 6H21" />
              <path d="M3 12H21" />
              <path d="M3 18H21" />
            </svg>

            <span className="text-lg font-semibold">회원정보 설정</span>
          </div>
        </header>

        {/* 메인 내용 */}
        <main className="w-full px-5 py-5">
          {/* 입력 박스 반복 */}
          {[
            { label: "회원명", key: "name" },
            { label: "학번", key: "studentId" },
          ].map((item) => (
            <div className="mb-4" key={item.key}>
              <label className="block font-medium mb-1">{item.label}</label>
              <input
                name={item.key}
                type="text"
                value={(form as any)[item.key]}
                onChange={handleChange}
                readOnly={!editable}
                className={`w-full border rounded px-3 py-2 ${
                  editable ? "bg-white" : "bg-gray-200"
                }`}
              />
            </div>
          ))}

          {/* 비밀번호 */}
          <div className="mb-4">
            <label className="block font-medium mb-1">비밀번호</label>
            <input
              type="password"
              readOnly
              onClick={() => navigate("/password")}
              className="w-full border rounded px-3 py-2 bg-gray-200 cursor-pointer"
              placeholder="비밀번호 변경하기"
            />
          </div>

          {/* 전공 */}
          <div className="mb-4">
            <label className="block font-medium mb-1">학부/전공</label>
            <input
              name="major"
              type="text"
              value={form.major}
              onChange={handleChange}
              readOnly={!editable}
              className={`w-full border rounded px-3 py-2 ${
                editable ? "bg-white" : "bg-gray-200"
              }`}
            />
          </div>

          {/* 학년 */}
          <div className="mb-4">
            <label className="block font-medium mb-1">학년</label>
            <input
              name="grade"
              type="number"
              value={form.grade}
              onChange={handleChange}
              readOnly={!editable}
              className={`w-full border rounded px-3 py-2 ${
                editable ? "bg-white" : "bg-gray-200"
              }`}
            />
          </div>

          {/* 이메일 */}
          <div className="mb-4">
            <label className="block font-medium mb-1">이메일</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              readOnly={!editable}
              className={`w-full border rounded px-3 py-2 ${
                editable ? "bg-white" : "bg-gray-200"
              }`}
            />
          </div>

          {/* 전화번호 */}
          <div className="mb-4">
            <label className="block font-medium mb-1">전화번호</label>
            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              readOnly={!editable}
              placeholder="010-0000-0000"
              className={`w-full border rounded px-3 py-2 ${
                editable ? "bg-white" : "bg-gray-200"
              }`}
            />
          </div>

          {/* 검색 주기 */}
          <div className="mb-4">
            <label className="block font-medium mb-1">키워드 자동검색 주기</label>
            <select
              name="cycle"
              disabled={!editable}
              value={form.cycle}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option>1주일</option>
              <option>2주</option>
              <option>1개월</option>
            </select>
          </div>

          {/* 알림 설정 */}
          <div className="flex items-center mb-4">
            <label className="font-medium mr-3">알림설정</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                disabled={!editable}
                checked={form.notify}
                onChange={() =>
                  setForm({ ...form, notify: !form.notify })
                }
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#B783FF] rounded-full transition" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition" />
            </label>
          </div>

          {/* 테마 */}
          <div className="mb-6">
            <label className="block font-medium mb-2">테마</label>
            <div className="flex gap-5">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                />
                라이트
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                />
                다크
              </label>
            </div>
          </div>

          {/* 수정 버튼 */}
          <button
            className="w-full py-3 rounded bg-[#B783FF] text-white font-semibold"
            onClick={() => setEditable(!editable)}
          >
            {editable ? "수정 완료" : "수정"}
          </button>
        </main>
      </div>
    </div>
  );
}
