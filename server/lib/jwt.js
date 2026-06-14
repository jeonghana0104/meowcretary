// JWT 발급/검증 (로그인 5·6단계)
// 비밀키는 server/.env의 JWT_SECRET — 절대 코드/깃에 두지 않는다.
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '2h';

if (!SECRET) {
  console.warn('⚠️  JWT_SECRET이 설정되지 않았습니다. server/.env에 JWT_SECRET을 넣어주세요.');
}

// payload 예: { studentId }
export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

// 유효하지 않거나 만료된 토큰이면 throw
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
