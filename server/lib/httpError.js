// 상태코드를 가진 에러. 핸들러에서 throw httpError(400, '...') 하면
// 중앙 에러 핸들러(index.js)가 그 상태코드로 응답한다.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const httpError = (status, message) => new HttpError(status, message);
