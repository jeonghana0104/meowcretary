// 비밀번호 해시/검증 — ERD의 User.Password 필드에 평문 대신 해시를 저장한다.
// 외부 라이브러리 없이 Node 내장 crypto(scrypt) 사용.
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

export function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(String(plain), salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(plain, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const hashBuf = Buffer.from(hash, 'hex');
  const testBuf = scryptSync(String(plain), salt, 64);
  return hashBuf.length === testBuf.length && timingSafeEqual(hashBuf, testBuf);
}
