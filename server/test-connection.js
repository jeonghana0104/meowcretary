// Firebase Admin 연결이 실제로 동작하는지 검증하는 스크립트
// 실행: npm run test:firebase
import { readFileSync } from 'node:fs';
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const keyPath =
  process.env.FIREBASE_SERVICE_ACCOUNT ??
  new URL('./meowcretary-firebase-adminsdk-fbsvc-6d634af0a5.json', import.meta.url);
const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));

const credential = cert(serviceAccount);
const app = initializeApp({ credential });

console.log(`🔌 Firebase 연결 테스트 (project: ${serviceAccount.project_id})...`);

// 1단계: 서비스 계정 키로 OAuth 토큰을 실제 발급받아 자격증명 유효성 확인
try {
  const token = await credential.getAccessToken();
  console.log('✅ 1/2 자격증명 유효: 서비스 계정 키로 액세스 토큰 발급 성공');
  console.log(`        (token 만료까지 ${token.expires_in}s)`);
} catch (err) {
  console.error('❌ 자격증명 무효:', err.message);
  process.exit(1);
}

// 2단계: Firebase Auth 사용 가능 여부 확인 (활성화 안 됐으면 안내만)
try {
  const result = await getAuth(app).listUsers(1);
  console.log(`✅ 2/2 Firebase Auth 사용 가능: 사용자 ${result.users.length}명(샘플) 조회됨`);
} catch (err) {
  console.warn('⚠️  2/2 Firebase Auth 미설정:', err.message);
  console.warn('    → Firebase 콘솔 > Authentication > 시작하기 에서 활성화하면 됩니다.');
}

process.exit(0);
