// 현재 로그인한 사용자 식별 미들웨어.
//
// ⚠️ 로그인 기능은 아직 미구현(프론트에서 비번 '1234' 하드코딩)이라,
//    지금은 요청 헤더 `x-student-id`(학번)로 현재 사용자를 임시 식별한다.
//    추후 로그인이 붙으면 이 미들웨어의 내부만 토큰 검증으로 교체하면 되고,
//    라우터/프론트의 호출부는 그대로 두면 된다. (인증 경계를 여기 한 곳에 모아둠)
export function requireUser(req, res, next) {
  const studentId = req.header('x-student-id');
  if (!studentId) {
    return res.status(401).json({ error: '인증 정보가 없습니다. (x-student-id 헤더 필요)' });
  }
  req.studentId = String(studentId);
  next();
}
