# jhn 브랜치 작업 정리 (메뉴별 상세)

> `jhn` 브랜치에서 작업한 내용을 **메뉴별로** 어떤 로직으로 작동하는지 자세히 설명합니다.
> 정하나 담당: 로그인/회원가입(인증), 회원정보, 키워드, 그리고 대시보드·공지의 "키워드 연결" 부분.

---

## 0. 전체 구조

```
[프론트] React + TS + Vite (src/)
   │  fetch (REST, Authorization: Bearer <JWT>)
   ▼
[내 백엔드] Node.js + Express + firebase-admin (server/)  ← 회원/키워드/인증
   │
   ▼
[DB] Firebase Firestore  (User / Keyword / EmailVerification 컬렉션)

[조예인 백엔드] Python FastAPI (crawler/, :8000)  ← 공지 크롤링 + 구글 캘린더 연동
```

- **인증**: JWT + localStorage. 로그인하면 토큰을 저장하고, 모든 요청에 `Authorization: Bearer` 헤더로 보냄.
- **사용자 식별**: `server/middleware/requireUser.js`가 토큰을 검증해 `studentId`를 꺼냄 → 회원·키워드 API 전부 "로그인한 사람" 기준으로 동작.
- **공통 제약**: 이메일은 반드시 `@hanyang.ac.kr`.
- **프론트 API 클라이언트**: `src/api/api.ts` 한 곳에 모든 호출 함수 정리. 공통 `request()` 헬퍼가 헤더 주입·에러처리 담당.

---

## 1. 로그인 / 회원가입 (인증)

화면: `src/page/Login/login.tsx`, `src/page/Signup/Signup.tsx`
백엔드: `server/routes/auth.js`, `server/lib/jwt.js`, `server/lib/password.js`

### 1-1. 아이디/비번 로그인 — `POST /api/auth/login`
```
입력(이메일 또는 학번 + 비번)
 → ① 입력검증(빈값/길이)
 → ② 사용자 조회 (@ 있으면 이메일, 없으면 학번=문서ID)
 → ③ scrypt 해시 비교 (timingSafeEqual). 실패 메시지 통일 → 계정 열거 방지
 → ④ JWT 발급({studentId}, 2시간) → 프론트가 localStorage에 저장
```

### 1-2. 회원가입 — `POST /api/auth/signup`
```
입력 → 필수값 검증 → @hanyang.ac.kr 강제 → 학번 숫자검증 → 비번 8자+
 → 학번 중복(409)/이메일 중복(409) 검사
 → User 문서 생성(학번=PK, 비번 scrypt 해시)  ※ 학년 '2학년'→'2' 정규화
 → 가입 즉시 JWT 발급(자동 로그인)
```

### 1-3. 구글 로그인 — `POST /api/auth/google` (+ `/google/complete`)
```
구글 버튼 → Firebase signInWithPopup(hd:hanyang.ac.kr) → Firebase ID 토큰
 → 백엔드 admin.verifyIdToken() 검증 + @hanyang 도메인 재확인
 → 기존 계정(이메일 일치) → 바로 로그인(JWT)
 → 신규 → { needsOnboarding:true } 응답 → 프론트가 "학번 입력" 모달 표시
        → POST /api/auth/google/complete (학번 등) → User 생성 → 로그인
```
- 구글 계정: `provider:'google'`, `password:''`(비번 없음), `emailVerified:true`, 구글 프로필 사진 사용.
- Firebase 웹 config는 `src/firebase.ts`가 `.env`(VITE_FIREBASE_*)에서 읽음. `auth`만 export.

### 1-4. 인증 미들웨어 (핵심 연결)
`requireUser.js`: `Authorization: Bearer <JWT>` 검증 → `req.studentId`. 이 한 곳이 회원·키워드 API의 "현재 사용자"를 결정.

### 1-5. 라우트 가드 / 로그아웃
- `src/App.tsx`의 `RequireAuth`: 토큰 없으면 보호 페이지 접근 시 `/login`으로.
- 로그아웃: 모든 화면이 `logout()`(토큰 삭제) 호출 후 `/login` 이동.

---

## 2. 회원 설정 (`/member`)

화면: `src/page/Setting/setting.tsx`
백엔드: `server/routes/user.js`

| 동작 | API | 로직 |
|---|---|---|
| 진입 시 로드 | `GET /api/user/me` | 토큰의 사용자 정보 표시 |
| 저장 | `PATCH /api/user/me` | 이름·전화·학년·검색주기·알림설정 (검증 포함) |
| 프로필 사진 | `POST /api/user/me/photo` | 프론트에서 256px 리사이즈 → **base64로 Firestore 저장** (무료 요금제, Storage 미사용) |
| 이메일 인증 | `POST /me/email/verify-request`·`verify-confirm` | 현재 이메일로만 인증코드 발송(이메일 변경 불가) |
| 비밀번호 변경 | `PATCH /me/password` | 현재 비번 확인 후 변경. **구글 계정이면** "비밀번호 없음" 안내 표시 |
| 알림 설정 | (PATCH /me에 포함) | 공지/키워드/지도 카테고리별 토글 |

- 사이드바 유저명·사진은 로그인한 사람으로 **동적 표시**.

---

## 3. 키워드 관리 (`/keyword`)

화면: `src/page/Keyword/keyword.tsx`
백엔드: `server/routes/keyword.js` → Firestore `Keyword` 컬렉션 (`{studentId, keyword, createdAt}`)

```
진입 → GET /api/keywords (내 키워드 목록)
추가 → POST /api/keywords  (중복 409, 빈값 400, 최대 50개)
삭제 → DELETE /api/keywords/:id (소유권 체크 → 남의 것 삭제 시 403)
검색 → GET /api/keywords/select?q=
```
> 정렬·페이징 기능은 별도 stash 보관 중(아직 미반영).

---

## 4. 대시보드 (`/dashboard`)

화면: `src/page/Dashboard/dashboard.tsx` (조예인 화면 + 내가 키워드 연결)

- **공지 목록**: 조예인 크롤러 `getHanyangNotice()`(:8000)에서 가져옴. 체크박스로 선택 → `syncExternalApps()`로 구글 캘린더 연동.
- **키워드 부분(내가 연결)**:
  - 하드코딩 `KEYWORDS` 배열 **제거** → `getKeywords()`(내 Express)로 로드
  - "등록된 키워드" 통계 카드 = `keywords.length` (실제값)
  - "관심 키워드" 패널 = 실제 등록 키워드 표시 (없으면 안내 문구)
  - → **키워드 관리에서 추가/삭제하면 대시보드에 그대로 반영**

---

## 5. 공지·정보 (`/notices`)

화면: `src/page/Notices/NoticesPage.tsx` (조예인 화면 + 내가 키워드 연결)

```
로드 → ① 내 키워드(getKeywords, Express)로 상단 키워드 탭 구성
      → ② 크롤러 공지(getHanyangNotice)를 가져와, 제목에 내 키워드가 포함되면 그 키워드로 분류
선택 탭 → 해당 키워드로 분류된 공지만 필터링 표시
```
> 기존엔 조예인 크롤러 키워드(`getUserKeywords`, :8000)를 썼으나, **내 Express 키워드(`getKeywords`)로 통일**함.

---

## 6. 그 외 메뉴 (팀원 담당 — 참고)
- **앱 연동 / 캘린더 / 크롤링**: 조예인 (`crawler/` 파이썬, 구글 캘린더). 비밀키 `crawler/credentials.json`·`token.json`은 `.gitignore`로 제외.
- **캠퍼스 지도(`/map`)**: 정해린 (카카오 지도).
- **알림 설정(`/notifications`)**: 화면만 존재.

---

## 7. 이번에 정리한 것 (유지보수)
- **죽은 코드 삭제**: `src/api/keywords.ts`(조예인 client-SDK 키워드, 미사용), `api.ts`의 `getUserKeywords`·`axios` import, `firebase.ts`의 `db`(미사용) 제거
- **키워드 단일화**: 대시보드·공지 모두 내 Express 키워드(`getKeywords`)로 통일 (이전엔 하드코딩/크롤러로 갈라져 있었음)
- **빌드 통과**: 미사용 변수(`handleSelectNotice` 등) 정리로 `npm run build` 정상 (이전엔 막혀 있었음)

---

## 8. 데이터 모델 (Firestore)

### `User` (문서ID = 학번)
```jsonc
{
  studentId, name, email, emailVerified, tel,
  password,            // scrypt 해시 (구글 계정은 "")
  provider,            // "local" | "google"
  searchCycle, major, college, dept, grade, admYear,
  photoUrl,            // base64 (구글은 구글 사진)
  notificationSettings: { notice, keyword, map },
  fcmTokens: [],
  createdAt, updatedAt
}
```
### `Keyword` (문서ID = 자동)
```jsonc
{ studentId, keyword, createdAt }
```
### `EmailVerification` (문서ID = 학번)
```jsonc
{ email, code, expiresAt, createdAt }   // 인증코드 임시저장(5분)
```

---

## 9. 실행 방법
```bash
# 1) 내 백엔드
cd server && npm install && npm run dev      # http://localhost:4000

# 2) 프론트
npm install && npm run dev                   # http://localhost:5173
#  ※ 루트 .env 에 VITE_FIREBASE_* 필요 (구글 로그인) — .env.example 참고

# 3) (선택) 조예인 크롤러 — 공지/캘린더
cd crawler && (파이썬 의존성 설치) && uvicorn main:app  # http://localhost:8000
#  ※ crawler/credentials.json, token.json 필요 (구글 캘린더)
```

## 10. 미완성 / 주의
- 로그인 4단계(rate-limit)·키워드 정렬·페이징은 미반영(후자는 stash 보관)
- 대시보드·키워드 등 일부 화면 사이드바 유저명은 회원설정 외엔 아직 하드코딩
- `axios` 패키지는 이제 미사용(원하면 package.json에서 제거 가능)
