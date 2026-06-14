import axios from 'axios'; // 조예인 크롤러 연동 함수(getUserKeywords 등)에서 사용

// 백엔드(Express + Firebase) 호출 클라이언트
// 서버: server/ 폴더 (기본 http://localhost:4000)

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

// 로그인 시 받은 JWT를 localStorage에 보관하고, 요청마다 Authorization 헤더로 보낸다. (로그인 6단계)
const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
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

// ── 인증(로그인) ──
export interface LoginResult {
  token: string;
  user: { studentId: string; name: string };
}

// POST /api/auth/login — 이메일 또는 학번 + 비밀번호. 성공 시 토큰을 localStorage에 저장
export async function login(identifier: string, password: string): Promise<LoginResult> {
  const res = await request<LoginResult>('/api/auth/login', {
    method: 'POST',
    body: { identifier, password },
  });
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem('studentId', res.user.studentId);
  localStorage.setItem('name', res.user.name);
  return res;
}

// 로그아웃 — 토큰 삭제 (JWT는 무상태)
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('studentId');
  localStorage.removeItem('name');
}

// 사이드바 등에서 쓸 현재 로그인 사용자 이름
export const getUserName = () => localStorage.getItem('name') ?? '';

// 회원가입 입력 (이메일은 반드시 @hanyang.ac.kr)
export interface SignupInput {
  name: string;
  studentId: string;
  email: string;
  password: string;
  college?: string;
  dept?: string;
  grade?: string;
  admYear?: string;
}

// POST /api/auth/signup — 계정 생성 후 자동 로그인(토큰 저장)
export async function signup(input: SignupInput): Promise<LoginResult> {
  const res = await request<LoginResult>('/api/auth/signup', { method: 'POST', body: input });
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem('studentId', res.user.studentId);
  localStorage.setItem('name', res.user.name);
  return res;
}

// 구글 로그인 응답: 기존 계정이면 로그인(토큰), 신규면 온보딩(학번 입력) 필요
export type GoogleAuthResponse =
  | { needsOnboarding: false; token: string; user: { studentId: string; name: string } }
  | { needsOnboarding: true; email: string; name: string };

// POST /api/auth/google — 구글 토큰 검증 → 기존이면 로그인 / 신규면 온보딩 안내
export async function googleLogin(idToken: string): Promise<GoogleAuthResponse> {
  const res = await request<GoogleAuthResponse>('/api/auth/google', { method: 'POST', body: { idToken } });
  if (!res.needsOnboarding) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem('studentId', res.user.studentId);
  localStorage.setItem('name', res.user.name);
  }
  return res;
}

// POST /api/auth/google/complete — 구글 신규 사용자 가입 완료 (학번 입력 후)
export interface GoogleCompleteInput {
  idToken: string;
  studentId: string;
  college?: string;
  dept?: string;
  grade?: string;
  admYear?: string;
}
export async function googleComplete(input: GoogleCompleteInput): Promise<LoginResult> {
  const res = await request<LoginResult>('/api/auth/google/complete', { method: 'POST', body: input });
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem('studentId', res.user.studentId);
  localStorage.setItem('name', res.user.name);
  return res;
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
  provider?: string;     // 'google' 이면 비밀번호 없음
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

// ── 키워드 ──
export interface Keyword {
  id: string;
  keyword: string;
  createdAt?: string | null;
}

// GET /api/keywords — 내 키워드 목록 (최신순)
export const getKeywords = () => request<Keyword[]>('/api/keywords');

// POST /api/keywords — 키워드 추가
export const addKeyword = (keyword: string) =>
  request<{ id: string; keyword: string }>('/api/keywords', { method: 'POST', body: { keyword } });

// DELETE /api/keywords/:id — 키워드 삭제
export const deleteKeyword = (id: string) =>
  request<{ ok: boolean }>(`/api/keywords/${id}`, { method: 'DELETE' }).then(() => undefined);

// ── 외부 연동 (조예인 / main 머지) ──
// 한양대 공지사항 데이터 (파이썬 크롤러 백엔드 :8000)
export const getHanyangNotice = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/hanyang-notice');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("공지사항 가져오기 실패ㅠ:", error);
    return { success: false, count: 0, data: [] };
  }
};

// 🌟 [2단계 추가] 선택한 공지사항 데이터를 백엔드로 전송하는 함수 추가
export const syncExternalApps = async (selectedNotices: any[]) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/sync-apps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedNotices), // 선택된 공지 데이터를 JSON 문자열로 변환하여 전송
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("외부앱 연동 전송 실패ㅠ:", error);
    return { success: false, message: "통신 실패", detail: { google_calendar: [], notepad: [] } };
  }
};

export const getUserKeywords = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/keywords");
    return response.data;
  } catch (error) {
    console.error("키워드 목록 호출 실패:", error);
    // 🌟 서버가 꺼져있어도 프론트 시연이 멈추지 않게 기본 키워드를 반환해주는 안전장치
    return {
      success: true,
      data: ['장학금', '공모전', '인턴십', '기말고사', 'SW학부', '채용', '도서관']
    };
  }
};
