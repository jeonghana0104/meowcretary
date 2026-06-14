// 현재 로그인한 사용자 식별 미들웨어 (로그인 6단계: 토큰 검증)
//
// Authorization: Bearer <JWT> 헤더를 검증해 req.studentId 를 채운다.
// → 회원정보·키워드 등 보호된 모든 API가 이 한 곳을 통해 "로그인한 사람"을 식별한다.
import { verifyToken } from '../lib/jwt.js';
import { httpError } from '../lib/httpError.js';

export function requireUser(req, res, next) {
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) return next(httpError(401, '로그인이 필요합니다.'));

  try {
    const payload = verifyToken(token);
    req.studentId = String(payload.studentId);
    next();
  } catch {
    next(httpError(401, '인증이 만료되었거나 올바르지 않습니다. 다시 로그인해주세요.'));
  }
}
