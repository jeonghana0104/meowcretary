// 인증(로그인/회원가입) 라우터 — JWT 발급
//   POST /api/auth/signup   회원가입 (한양대 이메일 필수) → 계정 생성 + JWT
//   POST /api/auth/login    아이디(이메일 또는 학번) + 비밀번호 → JWT 발급
//   POST /api/auth/logout   무상태(프론트가 토큰 삭제) — 형식상 엔드포인트
//
// 로그인 보안 단계: 1)입력검증 2)사용자조회 3)해시검증 5)토큰발급
// (4단계 rate-limit는 이번 범위에서 제외)
import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db, auth } from '../firebase.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { httpError } from '../lib/httpError.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { signToken } from '../lib/jwt.js';

const router = Router();

const SCHOOL_DOMAIN = '@hanyang.ac.kr';

// ── POST /api/auth/signup ─────────────────────────────────────────
router.post('/signup', asyncHandler(async (req, res) => {
  const b = req.body ?? {};
  const name = String(b.name ?? '').trim();
  const studentId = String(b.studentId ?? '').trim();
  const email = String(b.email ?? '').trim().toLowerCase();
  const password = String(b.password ?? '');
  const college = String(b.college ?? '').trim();
  const dept = String(b.dept ?? '').trim();

  // 1) 필수값 검증
  if (!name || !studentId || !email || !password) {
    throw httpError(400, '이름·학번·이메일·비밀번호는 필수입니다.');
  }
  // 2) 한양대 이메일 강제 (이게 핵심 조건)
  if (!email.endsWith(SCHOOL_DOMAIN)) {
    throw httpError(400, `한양대학교 이메일(${SCHOOL_DOMAIN})로만 가입할 수 있습니다.`);
  }
  // 3) 형식 검증
  if (!/^\d{6,12}$/.test(studentId)) throw httpError(400, '학번은 숫자만 입력해주세요.');
  if (password.length < 8) throw httpError(400, '비밀번호는 8자 이상이어야 합니다.');

  // 4) 중복 검사 — 학번(문서 ID) + 이메일
  const userRef = db.collection('User').doc(studentId);
  if ((await userRef.get()).exists) throw httpError(409, '이미 가입된 학번입니다.');
  const emailDup = await db.collection('User').where('email', '==', email).limit(1).get();
  if (!emailDup.empty) throw httpError(409, '이미 사용 중인 이메일입니다.');

  // '2학년' → '2', '2024년' → '2024' 로 정규화
  const grade = (String(b.grade ?? '').match(/\d/) ?? ['1'])[0];
  const admYear = (String(b.admYear ?? '').match(/\d{4}/) ?? [''])[0];

  // 5) 계정 생성 (회원정보 스키마와 동일)
  await userRef.set({
    studentId,
    name,
    email,
    emailVerified: false,
    tel: '',
    password: hashPassword(password),
    searchCycle: '1주일',
    major: dept,
    college,
    dept,
    grade,
    admYear,
    photoUrl: null,
    notificationSettings: { notice: true, keyword: true, map: true },
    fcmTokens: [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  // 6) 가입 직후 바로 로그인 상태가 되도록 토큰 발급
  const token = signToken({ studentId });
  res.status(201).json({ token, user: { studentId, name } });
}));

// 식별자(이메일 또는 학번)로 User 문서 조회
async function findUserDoc(identifier) {
  const id = identifier.trim();
  if (id.includes('@')) {
    const snap = await db.collection('User').where('email', '==', id.toLowerCase()).limit(1).get();
    return snap.empty ? null : snap.docs[0];
  }
  const doc = await db.collection('User').doc(id).get();
  return doc.exists ? doc : null;
}

// ── POST /api/auth/login ──────────────────────────────────────────
router.post('/login', asyncHandler(async (req, res) => {
  // 1단계: 입력 검증
  const identifier = String(req.body?.identifier ?? req.body?.email ?? '').trim();
  const password = String(req.body?.password ?? '');
  if (!identifier || !password) throw httpError(400, '아이디와 비밀번호를 입력해주세요.');
  if (identifier.length > 100 || password.length > 200) throw httpError(400, '입력값이 너무 깁니다.');

  // 2단계: 사용자 조회 / 3단계: 해시 검증
  //   (실패 메시지는 통일 → 계정 존재 여부 노출 방지)
  const FAIL = '아이디 또는 비밀번호가 올바르지 않습니다.';
  const doc = await findUserDoc(identifier);
  if (!doc) throw httpError(401, FAIL);

  const user = doc.data();
  if (!verifyPassword(password, user.password)) throw httpError(401, FAIL);

  // 5단계: 토큰 발급
  const token = signToken({ studentId: doc.id });
  res.json({ token, user: { studentId: doc.id, name: user.name } });
}));

// ── POST /api/auth/google ─────────────────────────────────────────
// 구글(Firebase) 로그인: 프론트가 보낸 Firebase ID 토큰을 검증하고,
// @hanyang.ac.kr 계정인지 확인한 뒤, 이미 가입된 User면 우리 JWT를 발급한다.
// (구글은 학번을 주지 않으므로, 신규 가입은 회원가입 폼으로만 — 여기선 이메일 일치 로그인만)
router.post('/google', asyncHandler(async (req, res) => {
  const idToken = String(req.body?.idToken ?? '');
  if (!idToken) throw httpError(400, '구글 토큰이 없습니다.');

  // 1) 구글 ID 토큰 검증 (진짜 구글 로그인인지)
  let decoded;
  try {
    decoded = await auth.verifyIdToken(idToken);
  } catch {
    throw httpError(401, '구글 인증에 실패했습니다. 다시 시도해주세요.');
  }

  // 2) 식별 정보. 학교 Workspace 계정은 이메일을 안 주기도 해서, 구글 고유 uid로도 식별한다.
  const email = String(decoded.email ?? '').toLowerCase();
  const googleUid = decoded.uid;
  // 이메일이 "있을 때만" 한양 도메인 검사 (없으면 uid로 식별하므로 통과)
  if (email && !email.endsWith(SCHOOL_DOMAIN)) {
    throw httpError(403, '한양대학교 구글 계정(@hanyang.ac.kr)으로만 로그인할 수 있습니다.');
  }

  // 3) 기존 계정 조회: 구글 uid 우선 → 없으면 이메일로
  let doc = null;
  const byUid = await db.collection('User').where('googleUid', '==', googleUid).limit(1).get();
  if (!byUid.empty) {
    doc = byUid.docs[0];
  } else if (email) {
    const byEmail = await db.collection('User').where('email', '==', email).limit(1).get();
    if (!byEmail.empty) {
      doc = byEmail.docs[0];
      await doc.ref.update({ googleUid }); // 다음부턴 uid로 바로 로그인되게 연결
    }
  }

  if (!doc) {
    // 신규 → 학번 입력 온보딩 필요
    return res.json({ needsOnboarding: true, email, name: decoded.name ?? '' });
  }

  // 기존 → 바로 로그인 (자동 로그인)
  const token = signToken({ studentId: doc.id });
  res.json({ needsOnboarding: false, token, user: { studentId: doc.id, name: doc.data().name } });
}));

// ── POST /api/auth/google/complete ────────────────────────────────
// 구글 신규 사용자의 가입 완료: 구글 토큰(이메일/이름) + 직접 입력한 학번/학과로 계정 생성
router.post('/google/complete', asyncHandler(async (req, res) => {
  const idToken = String(req.body?.idToken ?? '');
  if (!idToken) throw httpError(400, '구글 토큰이 없습니다.');

  // 이메일/이름은 클라이언트 말 믿지 않고 토큰에서 다시 꺼낸다
  let decoded;
  try {
    decoded = await auth.verifyIdToken(idToken);
  } catch {
    throw httpError(401, '구글 인증이 만료되었습니다. 다시 시도해주세요.');
  }
  const email = String(decoded.email ?? '').toLowerCase();
  const googleUid = decoded.uid;
  if (email && !email.endsWith(SCHOOL_DOMAIN)) {
    throw httpError(403, '한양대학교 구글 계정(@hanyang.ac.kr)으로만 가입할 수 있습니다.');
  }

  const studentId = String(req.body?.studentId ?? '').trim();
  if (!/^\d{6,12}$/.test(studentId)) throw httpError(400, '학번은 숫자만 입력해주세요.');

  // 중복 검사 (학번 + 구글 uid + 이메일)
  const userRef = db.collection('User').doc(studentId);
  if ((await userRef.get()).exists) throw httpError(409, '이미 가입된 학번입니다.');
  const uidDup = await db.collection('User').where('googleUid', '==', googleUid).limit(1).get();
  if (!uidDup.empty) throw httpError(409, '이미 가입된 구글 계정입니다.');
  if (email) {
    const emailDup = await db.collection('User').where('email', '==', email).limit(1).get();
    if (!emailDup.empty) throw httpError(409, '이미 사용 중인 이메일입니다.');
  }

  const college = String(req.body?.college ?? '').trim();
  const dept = String(req.body?.dept ?? '').trim();
  const grade = (String(req.body?.grade ?? '').match(/\d/) ?? ['1'])[0];
  const admYear = (String(req.body?.admYear ?? '').match(/\d{4}/) ?? [''])[0];
  // 구글 이름이 "정하나 | 학과 | 학교" 형태로 오면 앞부분(이름)만 사용
  const cleanName = (decoded.name ?? '').split('|')[0].trim() || '사용자';

  await userRef.set({
    studentId,
    name: cleanName,
    email,                          // 이메일 없으면 빈 문자열
    emailVerified: !!email,
    tel: '',
    password: '',                   // 구글 계정 → 비밀번호 없음 (구글로만 로그인)
    provider: 'google',
    googleUid,                      // 구글 계정 연결키 (다음 로그인 때 이걸로 식별)
    searchCycle: '1주일',
    major: dept,
    college,
    dept,
    grade,
    admYear,
    photoUrl: decoded.picture ?? null,  // 구글 프로필 사진
    notificationSettings: { notice: true, keyword: true, map: true },
    fcmTokens: [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const token = signToken({ studentId });
  res.status(201).json({ token, user: { studentId, name: decoded.name ?? '' } });
}));

// ── POST /api/auth/logout ─────────────────────────────────────────
// JWT는 무상태라 서버가 따로 폐기할 게 없다. 프론트에서 토큰을 지우면 끝.
router.post('/logout', (req, res) => res.json({ ok: true }));

export default router;
