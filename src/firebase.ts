// ────────────────────────────────────────────────────────────
// Firebase 클라이언트(웹) 설정
// 여기 들어가는 값은 "공개되어도 안전한 값"입니다. (마스터키 아님!)
//
// 📌 채우는 방법:
//   1) https://console.firebase.google.com → meowcretary 프로젝트
//   2) ⚙️(프로젝트 설정) → 아래로 스크롤 → "내 앱" 섹션
//   3) 웹 앱(</>)이 없으면 "앱 추가 → 웹" 클릭해서 하나 만들기
//   4) firebaseConfig 객체가 보이면 apiKey / messagingSenderId / appId 를 아래에 붙여넣기
// ────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB6RD3RFlg_IGPSG59kv__UIQ6FMfa3KPM',
  authDomain: 'meowcretary.firebaseapp.com',
  projectId: 'meowcretary',
  storageBucket: 'meowcretary.firebasestorage.app',
  messagingSenderId: '178655890753',
  appId: '1:178655890753:web:a4401f412937178f1ba5c0',
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore(DB) 핸들 — 다른 파일에서 import 해서 씀
export const db = getFirestore(app);

// 구글 로그인용 Auth 핸들
export const auth = getAuth(app);
