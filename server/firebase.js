// Firebase Admin SDK 초기화 (서버 전용 — 절대 프론트엔드에 import 금지)
import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// 서비스 계정 키 경로 (환경변수로 덮어쓸 수 있음)
const keyPath =
  process.env.FIREBASE_SERVICE_ACCOUNT ??
  new URL('./meowcretary-firebase-adminsdk-fbsvc-6d634af0a5.json', import.meta.url);

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));

const app = initializeApp({
  credential: cert(serviceAccount),
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const projectId = serviceAccount.project_id;
