// async 라우트 핸들러의 에러를 자동으로 next(err)로 넘겨준다.
// → 각 핸들러에서 try/catch 보일러플레이트를 없앨 수 있다.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
