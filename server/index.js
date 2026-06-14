import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { projectId } from './firebase.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import keywordRouter from './routes/keyword.js';

const app = express();
app.use(cors());
app.use(express.json());

// 서버 상태 확인
app.get('/api/health', (req, res) => {
  res.json({ ok: true, project: projectId });
});

// 인증(로그인) 라우터
app.use('/api/auth', authRouter);

// 회원정보 라우터
app.use('/api/user', userRouter);

// 키워드 라우터
app.use('/api/keywords', keywordRouter);

// 중앙 에러 핸들러 — 핸들러에서 throw 한 에러를 여기서 응답으로 변환.
// HttpError면 그 상태코드로, 아니면 500. (각 핸들러의 try/catch 제거)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ meowcretary 서버 실행 중: http://localhost:${PORT}`);
  console.log(`   Firebase project: ${projectId}`);
});
