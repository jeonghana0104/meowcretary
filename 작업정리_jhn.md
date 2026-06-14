# 비서냥이 — 작업 정리 (jhn 브랜치 / 정하나)

> 이 문서는 `jhn` 브랜치에서 완료된 작업을 **메뉴별로** 나눠 어떤 파일이 어떻게 수정·추가됐는지 자세히 설명합니다.
> 작성 기준 커밋: `25cb102 (Merge branch 'main' into jhn)`

---

## 0. 전체 개요

### 아키텍처
```
[프론트엔드] React + TypeScript + Vite  (src/)
      │  fetch (REST)
      ▼
[백엔드] Node.js + Express + firebase-admin  (server/)   ← 정하나 신규 구축
      │
      ▼
[DB] Firebase Firestore   (User / Keyword / EmailVerification 컬렉션)
```

### Firebase 설정 결정 (중요)
| 항목 | 결정 | 이유 |
|---|---|---|
| Authentication | **사용 안 함** | ERD대로 User를 Firestore에 직접 저장, PK=학번 |
| Storage | **사용 안 함** | 무료(Spark) 요금제 → 프로필 사진은 base64로 Firestore 저장 |
| Firestore | **사용** | 회원·키워드 데이터 저장 |
| 비밀번호 | **scrypt 해시** | 평문 저장 금지 |
| 서비스 계정 키 | `.gitignore` 처리 | 비밀 키 깃 커밋 방지 |

### 현재 사용자 식별 (로그인 미구현 임시 처리)
로그인 기능이 아직 없어서, 모든 회원·키워드 API는 요청 헤더 **`x-student-id`(학번)** 로 현재 사용자를 임시 식별합니다.
→ 나중에 로그인이 붙으면 **`server/middleware/requireUser.js` 한 곳만** 토큰 검증으로 교체하면 됩니다.

---

## 1. 백엔드 공통 인프라 (`server/`) — 신규 구축

`server/` 폴더 전체가 이번에 새로 만들어졌습니다.

| 파일 | 역할 |
|---|---|
| `server/firebase.js` | Firebase Admin SDK 초기화. `auth`, `db`, `projectId` export |
| `server/index.js` | Express 앱. CORS·JSON 미들웨어, 라우터 등록, **중앙 에러 핸들러**, `/api/health` |
| `server/middleware/requireUser.js` | `x-student-id` 헤더 → `req.studentId` (인증 경계 한 곳에 모음) |
| `server/middleware/loadUser.js` | User 문서 로드 → `req.user`, `req.userRef`. 없으면 404 |
| `server/lib/asyncHandler.js` | async 라우트 에러 자동 전달 → try/catch 제거 |
| `server/lib/httpError.js` | `throw httpError(400, '...')` → 상태코드 응답 |
| `server/lib/password.js` | scrypt 비밀번호 해시/검증 (무의존성) |
| `server/lib/mailer.js` | 인증메일 발송 (개발 단계 stub — 콘솔 출력) |
| `server/routes/user.js` | 회원정보 라우터 (아래 2번) |
| `server/routes/keyword.js` | 키워드 라우터 (아래 3번) |
| `server/seed-user.js` | 테스트 User 1명 생성 (`npm run seed`) |
| `server/test-connection.js` | Firebase 연결 테스트 (`npm run test:firebase`) |
| `server/package.json` | express, cors, firebase-admin, multer, dotenv |
| `server/.env.example`, `server/README.md` | 설정 예시 · 사용법 |

### 실행 방법
```bash
cd server
npm install        # 최초 1회
npm run seed       # 테스트 사용자 (학번 2024000000 / 비번 test1234)
npm run dev        # http://localhost:4000
```

---

## 2. 회원정보 관리 (회원 설정) — `/member`

### 2-1. 백엔드 (`server/routes/user.js`)

| 메서드 · 엔드포인트 | 설명 |
|---|---|
| `GET /api/user/me` | 내 정보 조회 |
| `PATCH /api/user/me` | 정보 수정 (이름·전화·학년·검색주기·알림설정) + 검증 |
| `PATCH /api/user/me/password` | 비밀번호 변경 (현재 비번 확인 후) |
| `POST /api/user/me/photo` | 프로필 사진 업로드 (multipart → **base64로 Firestore 저장**) |
| `DELETE /api/user/me/photo` | 프로필 사진 삭제 |
| `POST /api/user/me/email/verify-request` | 이메일 인증코드 발송 (`@hanyang.ac.kr`만) |
| `POST /api/user/me/email/verify-confirm` | 인증코드 확인 → 이메일 갱신 |
| `POST /api/user/me/fcm-token` | FCM 기기 토큰 등록 |
| `DELETE /api/user/me/fcm-token` | FCM 기기 토큰 삭제 |

**검증 규칙**: 학년 1~4, 검색주기 `1일/1주일/1개월`, 비번 8자 이상, 이메일은 학교 도메인만.

### 2-2. Firestore `User` 스키마 (문서 ID = 학번)
```jsonc
{
  "studentId": "2024000000",   // 학번 (PK, 수정 불가)
  "name": "정하나",
  "email": "...@hanyang.ac.kr",
  "emailVerified": false,
  "tel": "010-0000-0000",
  "password": "<scrypt 해시>",
  "searchCycle": "1주일",       // 1일 | 1주일 | 1개월
  "major": "...", "college": "...", "dept": "...", "grade": "2", "admYear": "2024",
  "photoUrl": null,             // base64 data URL (프로필 사진)
  "notificationSettings": { "notice": true, "keyword": true, "map": true },
  "fcmTokens": [],
  "createdAt": "<Timestamp>", "updatedAt": "<Timestamp>"
}
```

### 2-3. 이메일 인증 임시 데이터 — `EmailVerification` 컬렉션
```jsonc
{ "email": "...", "code": "123456", "expiresAt": "<5분 후>", "createdAt": "..." }
```
> 메일 발송은 현재 stub(콘솔 출력)이며, 개발 중엔 응답에 `devCode`로 코드가 함께 옵니다. 운영 시 `server/lib/mailer.js`에 nodemailer만 연결하면 됩니다.

### 2-4. 프론트엔드 (`src/page/Setting/setting.tsx`)
- 화면 진입 시 `getMyInfo()`로 서버에서 내 정보 로드
- **저장하기** 버튼 → `updateMyInfo()` (수정 가능 필드만 전송)
- **프로필 사진**: 파일 선택 → 256px로 리사이즈·압축 후 업로드, 아바타에 이미지 표시
- **이메일 인증**: "이메일 인증" 버튼 → 코드 발송/확인 모달, 인증 시 ✓ 인증됨 배지
- **알림 설정**: 공지/키워드/지도 **카테고리별 토글 3개**
- **비밀번호 변경**: 모달에서 실제 API 호출
- (`src/api/api.ts`에 위 호출 함수들 작성)

---

## 3. 키워드 관리 — `/keyword`

### 3-1. 백엔드 (`server/routes/keyword.js`)

| 메서드 · 엔드포인트 | 설명 |
|---|---|
| `GET /api/keywords` | 내 키워드 목록 |
| `POST /api/keywords` | 키워드 추가 (중복 409, 빈값 400, **최대 50개**) |
| `DELETE /api/keywords/:id` | 키워드 삭제 (**소유권 체크** — 남의 것 삭제 시 403) |
| `GET /api/keywords/select?q=` | 키워드 검색 |

### 3-2. Firestore `Keyword` 스키마 (문서 ID = 자동생성)
```jsonc
{ "studentId": "2024000000", "keyword": "장학금", "createdAt": "<Timestamp>" }
```
> User 1 : N Keyword. 추후 조예인 담당 **크롤링 스케줄러**가 이 키워드를 읽어 결과를 생성하는 구조로 이어집니다.

### 3-3. 프론트엔드 (`src/page/Keyword/keyword.tsx`)
- 기존 **하드코딩 배열 제거** → 실제 API 연결 (진입 시 로드, 추가/삭제 시 서버 반영)
- (`src/api/api.ts`에 `getKeywords / addKeyword / deleteKeyword` 작성)

### 3-4. ⚠️ 정렬·페이징 기능 — **현재 git stash에 보관 중**
키워드 **정렬(최신순/등록순/가나다순) + 페이지네이션(10개씩)** 기능도 개발했으나,
main 병합 작업을 위해 **`git stash`에 임시 보관**된 상태입니다. (`stash@{0}`)
→ `git stash pop`으로 복원하면 적용됩니다. (백엔드 `?sort=&page=&limit=`, 프론트 드롭다운+페이지버튼)

---

## 4. 빌드 에러 수정 (배포용 빌드 통과)

`npm run build`(= `tsc -b && vite build`)가 미사용 import 때문에 실패하던 것을 수정:

| 파일 | 수정 내용 |
|---|---|
| `src/context/ThemeContext.tsx` | 미사용 `React` 제거, `ReactNode` → `type ReactNode` |
| `src/page/Menu/Menu.tsx` | 미사용 `import React` 제거 |
| `src/page/Setting/PasswordSetting.tsx` | 미사용 `React` 제거 |
| `src/page/Notices/NoticesPage.tsx` | 안 쓰는 인덱스 `i` 제거 |

→ 결과: **빌드 통과** (기능 변화 없음, 안 쓰던 코드만 정리)

---

## 5. 클린코드 리팩터링

| 대상 | 개선 |
|---|---|
| `server/routes/user.js` | `asyncHandler`로 try/catch 8개 제거, `loadUser`로 "조회→404" 중복 6회 제거, `httpError`로 에러 일원화 |
| `server/index.js` | **중앙 에러 핸들러** 추가 |
| `server/firebase.js` | base64 전환 후 안 쓰는 Storage/messaging import 제거 |
| `src/api/api.ts` | 공통 `request()` 헬퍼로 fetch·헤더·에러처리 중복 제거 |

---

## 6. main 병합으로 들어온 부분 (팀원 작업 — 참고)

`jhn`에 `main`을 병합하면서 함께 들어온 다른 팀원 작업:

| 항목 | 담당 | 위치 |
|---|---|---|
| 파이썬 크롤러 | 조예인 | `crawler/` |
| 공지/외부앱 연동 함수 | 조예인 | `src/api/api.ts`의 `getHanyangNotice`, `syncExternalApps` |
| Firebase 클라이언트 설정 | 조예인 | `src/firebase.ts` |
| 키워드(클라이언트 SDK 방식) | 조예인 | `src/api/keywords.ts` — **현재 미사용** |
| 대시보드 화면 업데이트 | 조예인 | `src/page/Dashboard/dashboard.tsx` |

### 병합 충돌 해결 내역
- `src/page/Keyword/keyword.tsx` → **내(정하나) Express 방식 채택**
- `src/api/api.ts` → **양쪽 함수 모두 유지** (내 REST 클라이언트 + 조예인 공지/연동 함수)

---

## 7. 미완성 / 주의사항

1. **로그인은 아직 가짜** — `src/page/Login/login.tsx`에서 비번 `'1234'` 하드코딩. 실제 인증 미구현 (조예인 담당).
2. **키워드 구현이 2개 공존** — 내 Express 방식(활성) vs 조예인 클라이언트 SDK 방식(`src/api/keywords.ts`, 미사용). 팀이 하나로 정리 필요.
3. **키워드 정렬·페이징은 stash에 보관 중** (4번… 3-4 참고).
4. **Firebase Storage 미사용** — 프로필 사진은 base64. Storage 켤 필요 없음.
5. **병합 후 빌드 미검증** — main이 `firebase` 패키지를 추가했으므로, 빌드 전 루트에서 `npm install` 필요할 수 있음.
6. **인증은 임시(`x-student-id` 헤더)** — 로그인 구현 후 `requireUser.js`만 토큰 검증으로 교체.

---

## 8. API 한눈에 보기

```
[회원정보]  server/routes/user.js
  GET    /api/user/me
  PATCH  /api/user/me
  PATCH  /api/user/me/password
  POST   /api/user/me/photo          DELETE /api/user/me/photo
  POST   /api/user/me/email/verify-request
  POST   /api/user/me/email/verify-confirm
  POST   /api/user/me/fcm-token      DELETE /api/user/me/fcm-token

[키워드]   server/routes/keyword.js
  GET    /api/keywords               (+ stash: ?sort=&page=&limit=)
  POST   /api/keywords
  DELETE /api/keywords/:id
  GET    /api/keywords/select?q=

[공통]
  GET    /api/health
```
