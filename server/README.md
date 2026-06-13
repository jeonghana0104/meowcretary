# meowcretary 백엔드 서버

Firebase Admin SDK를 사용하는 Node.js(Express) 백엔드 서버입니다.

## ⚠️ 보안 주의
- `meowcretary-firebase-adminsdk-fbsvc-*.json` 은 **비밀 키**입니다. 절대 깃에 커밋하거나 프론트엔드(`src/`)에 넣지 마세요. (이미 `.gitignore` 처리됨)
- 이 키는 채팅(카카오톡)으로 전달됐으므로, 가능하면 Firebase 콘솔에서 **키를 새로 발급(rotate)** 하는 것을 권장합니다.

## 설치 & 실행
```bash
cd server
npm install          # 최초 1회
npm run test:firebase  # 연결 테스트
npm run dev          # 개발 서버 실행 (http://localhost:4000)
```

## 엔드포인트
- `GET /api/health` — 서버 상태
- `GET /api/users/count` — Firebase Auth 사용자 수
- `GET /api/test-firestore` — Firestore 읽기 테스트

## 프론트엔드 연결
React 앱(`src/api/api.ts`)에서 `http://localhost:4000/api/...` 로 요청하면 됩니다.
