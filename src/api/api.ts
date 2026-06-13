// 백엔드(Express + Firebase) 호출 클라이언트
// 서버: server/ 폴더 (기본 http://localhost:4000)

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

// ⚠️ 로그인 기능이 아직 없어서 현재 사용자 학번을 임시로 보관/전송한다.
//    로그인이 붙으면 localStorage('studentId') 대신 토큰을 쓰도록 이 부분만 바꾸면 된다.
const FALLBACK_STUDENT_ID = '2024000000';

function authHeader(): Record<string, string> {
  return { 'x-student-id': localStorage.getItem('studentId') ?? FALLBACK_STUDENT_ID };
}

// 공통 요청 헬퍼 — 헤더 주입, JSON/FormData 구분, 에러 메시지 처리를 한 곳에 모은다.
async function request<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const isForm = init.body instanceof FormData;
  const res = await fetch(`${BASE}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      ...authHeader(),
      ...(init.body != null && !isForm ? { 'Content-Type': 'application/json' } : {}),
    },
    body: isForm ? (init.body as FormData) : init.body != null ? JSON.stringify(init.body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `요청 실패 (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// ── 알림 카테고리별 설정 ──
export interface NotificationSettings {
  notice: boolean;  // 공지
  keyword: boolean; // 키워드
  map: boolean;     // 지도
}

// ── 회원정보 타입 (Firestore User 문서) ──
export interface MemberInfo {
  studentId: string;     // 학번 (PK, 수정 불가)
  name: string;          // 이름
  email: string;         // 이메일
  emailVerified?: boolean;
  tel: string;           // 전화번호
  grade: string;         // 학년
  major: string;         // 전공 (표시용)
  college?: string;
  dept?: string;
  admYear?: string;
  searchCycle: string;   // 키워드 자동검색 주기 (1일 | 1주일 | 1개월)
  photoUrl?: string | null;          // 프로필 사진 (base64 data URL)
  notificationSettings?: NotificationSettings;
  fcmTokens?: string[];
}

// 수정 가능한 필드만
export interface MemberInfoPatch {
  name?: string;
  tel?: string;
  grade?: string;
  searchCycle?: string;
  notificationSettings?: NotificationSettings;
}

// GET /api/user/me — 내 정보 조회
export const getMyInfo = () => request<MemberInfo>('/api/user/me');

// PATCH /api/user/me — 내 정보 수정
export const updateMyInfo = (patch: MemberInfoPatch) =>
  request<{ ok: boolean; user: MemberInfo }>('/api/user/me', { method: 'PATCH', body: patch })
    .then((r) => r.user);

// PATCH /api/user/me/password — 비밀번호 변경
export const changePassword = (current: string, next: string) =>
  request<{ ok: boolean }>('/api/user/me/password', { method: 'PATCH', body: { current, next } })
    .then(() => undefined);

// POST /api/user/me/photo — 프로필 사진 업로드 (multipart). photoUrl(data URL) 반환
export const uploadProfilePhoto = (file: File) => {
  const fd = new FormData();
  fd.append('photo', file);
  return request<{ ok: boolean; photoUrl: string }>('/api/user/me/photo', { method: 'POST', body: fd })
    .then((r) => r.photoUrl);
};

// DELETE /api/user/me/photo — 프로필 사진 삭제
export const deleteProfilePhoto = () =>
  request<{ ok: boolean }>('/api/user/me/photo', { method: 'DELETE' }).then(() => undefined);

// POST /api/user/me/email/verify-request — 이메일 인증코드 발송
//  devCode: 개발 환경에서만 서버가 코드를 함께 반환(메일 미발송 테스트용)
export const requestEmailVerify = (email: string) =>
  request<{ ok: boolean; devCode?: string }>('/api/user/me/email/verify-request', {
    method: 'POST',
    body: { email },
  });

// POST /api/user/me/email/verify-confirm — 인증코드 확인 → 이메일 갱신
export const confirmEmailVerify = (email: string, code: string) =>
  request<{ ok: boolean }>('/api/user/me/email/verify-confirm', {
    method: 'POST',
    body: { email, code },
  }).then(() => undefined);

// POST /api/user/me/fcm-token — 이 기기의 FCM 토큰 등록
export const saveFcmToken = (token: string) =>
  request<{ ok: boolean }>('/api/user/me/fcm-token', { method: 'POST', body: { token } })
    .then(() => undefined);
