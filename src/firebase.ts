// ────────────────────────────────────────────────────────────
// Firebase 클라이언트(웹) 설정
// 값은 소스에 박지 않고 .env 의 VITE_FIREBASE_* 에서 읽는다.
// (웹 config 자체는 공개돼도 안전한 값이지만, 키를 소스/깃에 두지 않으려고 분리함)
//
// 📌 .env 채우는 법: 프로젝트 루트 .env 에 아래 값을 넣으세요. (.env.example 참고)
//   VITE_FIREBASE_API_KEY, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID 등
// ────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore(DB) 핸들 — 다른 파일에서 import 해서 씀
export const db = getFirestore(app);

// 구글 로그인용 Auth 핸들
export const auth = getAuth(app);
