// 회원정보(User) 라우터 — 제안서 API 설계(p.10) 기준
//   GET    /api/user/me                  내 정보 조회
//   PATCH  /api/user/me                  내 정보 수정 (이름·전화·학년·검색주기·알림설정)
//   PATCH  /api/user/me/password         비밀번호 변경
//   POST   /api/user/me/photo            프로필 사진 업로드 (multipart "photo" → base64)
//   DELETE /api/user/me/photo            프로필 사진 삭제
//   POST   /api/user/me/email/verify-request   이메일 인증코드 발송
//   POST   /api/user/me/email/verify-confirm   이메일 인증코드 확인 → 이메일 갱신
//   POST   /api/user/me/fcm-token        FCM 기기 토큰 등록
//   DELETE /api/user/me/fcm-token        FCM 기기 토큰 삭제
//
// 데이터 모델: Firestore `User` 컬렉션, 문서ID = 학번(studentId) — ERD의 User PK.
import { Router } from 'express';
import multer from 'multer';
import { randomInt } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../firebase.js';
import { requireUser } from '../middleware/requireUser.js';
import { loadUser } from '../middleware/loadUser.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { httpError } from '../lib/httpError.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { sendVerificationEmail } from '../lib/mailer.js';

const router = Router();

// 모든 회원정보 라우트는 [로그인 식별 → 사용자 로드]를 공통으로 거친다.
router.use(requireUser, loadUser);

// ── 헬퍼 ──
const toPublic = ({ password, ...rest }) => rest;        // 비밀번호 해시는 응답에서 제외
const withTimestamp = (data) => ({ ...data, updatedAt: FieldValue.serverTimestamp() });

// ── 상수 ──
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_PHOTO_BYTES = 700 * 1024; // base64는 ~1.33배 → Firestore 1MB 문서 제한 안에서 안전
const SCHOOL_DOMAIN = '@hanyang.ac.kr';
const VALID_CYCLES = ['1일', '1주일', '1개월'];
const VALID_GRADES = ['1', '2', '3', '4'];

// ── GET /me ───────────────────────────────────────────────────────
router.get('/me', asyncHandler(async (req, res) => {
  res.json(toPublic(req.user));
}));

// ── PATCH /me ─────────────────────────────────────────────────────
// 수정 가능: name, tel, grade, searchCycle, notificationSettings
// (email은 인증 플로우로만 변경 — 여기선 받지 않는다)
router.patch('/me', asyncHandler(async (req, res) => {
  const body = req.body ?? {};
  const updates = {};

  if ('name' in body) updates.name = String(body.name).trim();
  if ('tel' in body) updates.tel = String(body.tel).trim();
  if ('grade' in body) {
    if (!VALID_GRADES.includes(String(body.grade))) throw httpError(400, '학년은 1~4 사이여야 합니다.');
    updates.grade = String(body.grade);
  }
  if ('searchCycle' in body) {
    if (!VALID_CYCLES.includes(body.searchCycle)) throw httpError(400, '검색 주기는 1일/1주일/1개월 중 하나여야 합니다.');
    updates.searchCycle = body.searchCycle;
  }
  if (body.notificationSettings && typeof body.notificationSettings === 'object') {
    const ns = body.notificationSettings;
    updates.notificationSettings = { notice: !!ns.notice, keyword: !!ns.keyword, map: !!ns.map };
  }

  if (Object.keys(updates).length === 0) throw httpError(400, '수정할 항목이 없습니다.');

  await req.userRef.update(withTimestamp(updates));
  const after = await req.userRef.get();
  res.json({ ok: true, user: toPublic(after.data()) });
}));

// ── PATCH /me/password ────────────────────────────────────────────
router.patch('/me/password', asyncHandler(async (req, res) => {
  const { current, next } = req.body ?? {};
  if (!current || !next) throw httpError(400, '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
  if (String(next).length < 8) throw httpError(400, '새 비밀번호는 8자 이상이어야 합니다.');
  if (!verifyPassword(current, req.user.password)) throw httpError(401, '현재 비밀번호가 올바르지 않습니다.');

  await req.userRef.update(withTimestamp({ password: hashPassword(next) }));
  res.json({ ok: true });
}));

// ── POST /me/photo ────────────────────────────────────────────────
// 무료(Spark) 요금제에서는 Firebase Storage를 못 쓰므로, 작게 리사이즈된 이미지를
// base64 data URL로 Firestore User.photoUrl 에 저장한다. (프론트에서 256px로 축소해 전송)
router.post('/me/photo', upload.single('photo'), asyncHandler(async (req, res) => {
  if (!req.file) throw httpError(400, '사진 파일이 없습니다.');
  if (!IMAGE_MIMES.includes(req.file.mimetype)) throw httpError(400, '이미지 파일(jpg/png/webp/gif)만 업로드할 수 있습니다.');
  if (req.file.size > MAX_PHOTO_BYTES) throw httpError(400, '이미지가 너무 큽니다. 더 작은 사진을 사용하세요(최대 700KB).');

  const photoUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  await req.userRef.update(withTimestamp({ photoUrl }));
  res.json({ ok: true, photoUrl });
}));

// ── DELETE /me/photo ──────────────────────────────────────────────
router.delete('/me/photo', asyncHandler(async (req, res) => {
  await req.userRef.update(withTimestamp({ photoUrl: FieldValue.delete() }));
  res.json({ ok: true });
}));

// ── POST /me/email/verify-request ─────────────────────────────────
router.post('/me/email/verify-request', asyncHandler(async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!email.endsWith(SCHOOL_DOMAIN)) throw httpError(400, `학교 이메일(${SCHOOL_DOMAIN})만 인증할 수 있습니다.`);

  const code = String(randomInt(100000, 1000000)); // 6자리
  await db.collection('EmailVerification').doc(req.studentId).set({
    email,
    code,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5분
    createdAt: FieldValue.serverTimestamp(),
  });
  await sendVerificationEmail(email, code);

  // 개발 편의: 운영이 아니면 코드도 함께 반환 (메일 미발송 환경 테스트용)
  res.json({ ok: true, ...(process.env.NODE_ENV !== 'production' && { devCode: code }) });
}));

// ── POST /me/email/verify-confirm ─────────────────────────────────
router.post('/me/email/verify-confirm', asyncHandler(async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const code = String(req.body?.code ?? '');

  const vref = db.collection('EmailVerification').doc(req.studentId);
  const vsnap = await vref.get();
  if (!vsnap.exists) throw httpError(400, '인증 요청을 먼저 진행해주세요.');

  const v = vsnap.data();
  const expiresMs = v.expiresAt?.toMillis ? v.expiresAt.toMillis() : new Date(v.expiresAt).getTime();
  if (Date.now() > expiresMs) {
    await vref.delete();
    throw httpError(400, '인증코드가 만료되었습니다. 다시 요청해주세요.');
  }
  if (v.email !== email) throw httpError(400, '인증을 요청한 이메일과 다릅니다.');
  if (v.code !== code) throw httpError(400, '인증코드가 올바르지 않습니다.');

  await req.userRef.update(withTimestamp({ email, emailVerified: true }));
  await vref.delete();
  res.json({ ok: true });
}));

// ── FCM 기기 토큰 등록/삭제 ───────────────────────────────────────
const fcmToken = (req) => {
  const token = String(req.body?.token ?? '').trim();
  if (!token) throw httpError(400, 'FCM 토큰이 없습니다.');
  return token;
};

router.post('/me/fcm-token', asyncHandler(async (req, res) => {
  await req.userRef.update(withTimestamp({ fcmTokens: FieldValue.arrayUnion(fcmToken(req)) }));
  res.json({ ok: true });
}));

router.delete('/me/fcm-token', asyncHandler(async (req, res) => {
  await req.userRef.update(withTimestamp({ fcmTokens: FieldValue.arrayRemove(fcmToken(req)) }));
  res.json({ ok: true });
}));

export default router;
