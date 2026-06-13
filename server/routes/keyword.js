// 키워드(Keyword) 라우터 — 제안서 API 설계(p.10) 기준
//   GET    /api/keywords            내 키워드 목록 (최신순)
//   POST   /api/keywords            키워드 추가
//   DELETE /api/keywords/:id        키워드 삭제
//   GET    /api/keywords/select?q=  내 키워드 검색
//
// 데이터 모델: Firestore `Keyword` 컬렉션 (ERD의 Keyword 테이블)
//   { studentId(소유자 학번), keyword(문자열), createdAt }
import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../firebase.js';
import { requireUser } from '../middleware/requireUser.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { httpError } from '../lib/httpError.js';

const router = Router();
router.use(requireUser);

const keywords = () => db.collection('Keyword');
const MAX_KEYWORDS = 50;

const toMillis = (ts) => (ts?.toMillis ? ts.toMillis() : 0);
const toIso = (ts) => (ts?.toDate ? ts.toDate().toISOString() : null);

// 현재 사용자의 키워드 문서들 (where 단일 필드 → 복합 인덱스 불필요)
const myKeywords = (studentId) => keywords().where('studentId', '==', studentId).get();

// ── GET /api/keywords ─────────────────────────────────────────────
router.get('/', asyncHandler(async (req, res) => {
  const snap = await myKeywords(req.studentId);
  const items = snap.docs
    .map((d) => ({ id: d.id, keyword: d.data().keyword, createdAt: d.data().createdAt }))
    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt)) // 최신순 (메모리 정렬)
    .map(({ createdAt, ...rest }) => ({ ...rest, createdAt: toIso(createdAt) }));
  res.json(items);
}));

// ── GET /api/keywords/select?q= ───────────────────────────────────
// (':id'보다 먼저 선언 — 라우트 매칭 우선순위)
router.get('/select', asyncHandler(async (req, res) => {
  const q = String(req.query.q ?? '').trim().toLowerCase();
  const snap = await myKeywords(req.studentId);
  const items = snap.docs
    .map((d) => ({ id: d.id, keyword: d.data().keyword }))
    .filter((it) => !q || it.keyword.toLowerCase().includes(q));
  res.json(items);
}));

// ── POST /api/keywords ────────────────────────────────────────────
router.post('/', asyncHandler(async (req, res) => {
  const keyword = String(req.body?.keyword ?? '').trim();
  if (!keyword) throw httpError(400, '키워드를 입력해주세요.');

  const mine = await myKeywords(req.studentId);
  if (mine.docs.some((d) => d.data().keyword === keyword)) {
    throw httpError(409, '이미 등록된 키워드입니다.');
  }
  if (mine.size >= MAX_KEYWORDS) {
    throw httpError(400, `키워드는 최대 ${MAX_KEYWORDS}개까지 등록할 수 있습니다.`);
  }

  const ref = await keywords().add({
    studentId: req.studentId,
    keyword,
    createdAt: FieldValue.serverTimestamp(),
  });
  res.status(201).json({ id: ref.id, keyword });
}));

// ── DELETE /api/keywords/:id ──────────────────────────────────────
router.delete('/:id', asyncHandler(async (req, res) => {
  const ref = keywords().doc(req.params.id);
  const snap = await ref.get();
  if (!snap.exists) throw httpError(404, '키워드를 찾을 수 없습니다.');
  if (snap.data().studentId !== req.studentId) {
    throw httpError(403, '본인의 키워드만 삭제할 수 있습니다.');
  }
  await ref.delete();
  res.json({ ok: true });
}));

export default router;
