import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CatLogo from "../../assets/비서냥이.png";

export default function PasswordSetting() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const [successModal, setSuccessModal] = useState(false); // 수정완료 안내 모달

  const handleSubmit = () => {
    if (password.trim() === "" || password2.trim() === "") {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (password !== password2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError("");
    setSuccessModal(true); // alert → 성공 모달 실행
  };

  return (
    <div
      className="w-full min-h-screen flex justify-center items-center bg-[#e8f5e9]"
      style={{
        backgroundColor: "#e8f5e9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="w-[390px] h-[800px] bg-white border-[14px] border-black rounded-[45px] shadow-2xl flex flex-col overflow-hidden relative"
        style={{
          width: "390px",
          height: "800px",
          backgroundColor: "white",
          border: "14px solid black",
          borderRadius: "45px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ▼▼ 헤더 ▼▼ */}
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
            >
              비밀번호 변경
            </span>
          </div>
        </header>

        {/* ▼▼ 입력 영역 ▼▼ */}
        <div
          style={{
            flex: 1,
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <label className="font-medium" style={{ color: "#374151" }}>
            새 비밀번호
          </label>
          <input
            type="password"
            className="w-full border rounded-lg px-4 py-3 mb-8"
            style={{
              borderWidth: "1px",
              borderColor: "#d1d5db",
              borderRadius: "8px",
              padding: "14px 16px",
              marginBottom: "32px", // 간격 증가
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
          />

          <label className="font-medium" style={{ color: "#374151" }}>
            비밀번호 확인
          </label>
          <input
            type="password"
            className="w-full border rounded-lg px-4 py-3"
            style={{
              borderWidth: "1px",
              borderColor: "#d1d5db",
              borderRadius: "8px",
              padding: "14px 16px",
              marginBottom: "16px",
            }}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
          />

          {/* ❗에러 메시지 */}
          {error && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px",
                backgroundColor: "#ffe5e5",
                color: "#d32f2f",
                borderRadius: "6px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* ▼▼ 하단 버튼 ▼▼ */}
        <div style={{ padding: "20px" }}>
          <button
            className="w-full py-3.5 rounded-lg font-semibold mb-3"
            style={{
              width: "100%",
              backgroundColor: "#0A3A63",
              color: "white",
              padding: "14px 0",
              borderRadius: "8px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleSubmit}
          >
            변경하기
          </button>

          <button
            className="w-full py-3 font-medium"
            style={{
              width: "100%",
              padding: "12px 0",
              color: "#6b7280",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>

        {/* 하단 홈바 */}
        <div
          className="w-full h-8 bg-white flex justify-center items-start pt-1 shrink-0"
          style={{
            width: "100%",
            height: "32px",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "4px",
          }}
        >
          <div
            style={{
              width: "128px",
              height: "6px",
              backgroundColor: "#d1d5db",
              borderRadius: "9999px",
            }}
          ></div>
        </div>

        {/* ▼▼ 비밀번호 변경 성공 모달 ▼▼ */}
        {successModal && (
          <div
            className="fixed inset-0 flex justify-center items-center"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 50,
            }}
          >
            <div
              style={{
                width: "260px",
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  marginBottom: "24px",
                  color: "#1f2937",
                  fontWeight: 500,
                }}
              >
                비밀번호가<br />성공적으로 변경되었습니다.
              </p>

              <button
                style={{
                  backgroundColor: "#0A3A63",
                  width: "100px",
                  padding: "8px 0",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => navigate(-1)}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}