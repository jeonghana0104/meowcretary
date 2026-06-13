// 현재 사용자(req.studentId)의 User 문서를 로드한다.
// 없으면 404. 있으면 req.userRef(문서 참조) / req.user(데이터)를 채운다.
// → 핸들러마다 반복되던 "get → exists 체크 → 404"를 한 곳으로 모은다.
import { db } from '../firebase.js';
import { httpError } from '../lib/httpError.js';

export async function loadUser(req, res, next) {
  try {
    const ref = db.collection('User').doc(req.studentId);
    const snap = await ref.get();
    if (!snap.exists) throw httpError(404, '사용자를 찾을 수 없습니다.');
    req.userRef = ref;
    req.user = snap.data();
    next();
  } catch (err) {
    next(err);
  }
}
