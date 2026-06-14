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

const firebaseConfig = {
  apiKey: 'TODO_콘솔에서_복사', // ← 여기만 콘솔 값으로 교체
  authDomain: 'meowcretary.firebaseapp.com',
  projectId: 'meowcretary',
  storageBucket: 'meowcretary.firebasestorage.app',
  messagingSenderId: 'TODO_콘솔에서_복사', // ← 여기 교체
  appId: 'TODO_콘솔에서_복사', // ← 여기 교체
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore(DB) 핸들 — 다른 파일에서 import 해서 씀
export const db = getFirestore(app);
