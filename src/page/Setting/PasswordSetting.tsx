import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordSetting() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen bg-white border shadow p-5">
      <h2 className="text-xl font-semibold mb-5">비밀번호 변경</h2>

      <label className="block mb-1 font-medium">새 비밀번호</label>
      <input
        type="password"
        className="w-full border rounded px-3 py-2 mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="block mb-1 font-medium">비밀번호 확인</label>
      <input
        type="password"
        className="w-full border rounded px-3 py-2 mb-6"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />

      <button className="w-full bg-[#B783FF] text-white py-3 rounded font-semibold">
        변경하기
      </button>

      <button
        className="w-full mt-3 py-2 text-gray-500"
        onClick={() => navigate(-1)}
      >
        취소
      </button>
    </div>
  );
}
