# jhn 브랜치 — 로그인 / 회원가입 / 인증 작업 정리

> 이 문서는 `jhn` 브랜치에 올린 **로그인·회원가입·구글 로그인 + 인증 연동** 작업의 수정 내역과 로직을 자세히 설명합니다.

---

## 0. 한눈에 보기

- **방식**: JWT + localStorage (서버는 무상태)
- **백엔드**: Node.js(Express) + firebase-admin → Firestore `User` 컬렉션
- **사용자 키(PK)**: 학번(studentId) — ERD 기준
- **공통 제약**: 이메일은 반드시 `@hanyang.ac.kr`
- **인증 흐름**:
  ```
  회원가입(또는 구글 가입) → User 생성 → 자동 로그인(JWT 발급)
  로그인(이메일/학번 + 비번  또는  구글) → JWT 발급
       → 이후 모든 요청에 Authorization: Bearer <JWT>
       → requireUser가 토큰 검증 → 회원정보·키워드 자동 연결
  ```

---

## 1. 로그인 (이메일/학번 + 비밀번호)

### 엔드포인트: `POST /api/auth/login`
요청 `{ identifier, password }` (identifier = 이메일 또는 학번) → 응답 `{ token, user }`

### 로직 (보안 단계, 4단계 rate-limit 제외)
| 단계 | 처리 |
|---|---|
| 1 입력검증 | 빈값·길이(100/200자) 제한 |
| 2 사용자조회 | `@` 포함이면 이메일로 `where`, 아니면 학번(문서ID)로 조회 |
| 3 해시검증 | `scrypt` 해시 비교(`timingSafeEqual`). 실패 메시지 **통일**("아이디 또는 비밀번호가 올바르지 않습니다") → 계정 존재여부 노출 방지 |
| 5 토큰발급 | `{ studentId }` 페이로드로 JWT 서명(만료 2시간) |

### 파일
- 백엔드: `server/routes/auth.js`(login), `server/lib/jwt.js`(서명/검증), `server/lib/password.js`(scrypt)
- 프론트: `src/page/Login/login.tsx`(가짜 `'1234'` 제거 → 실제 호출), `src/api/api.ts`(`login()` — 토큰을 localStorage에 저장)

---

## 2. 회원가입 (아이디/비번)

### 엔드포인트: `POST /api/auth/signup`
요청 `{ name, studentId, email, password, college, dept, grade, admYear }` → `{ token, user }`(가입 즉시 자동 로그인)

### 로직
| 검증 | 내용 |
|---|---|
| 필수값 | 이름·학번·이메일·비밀번호 |
| **한양대 이메일** | `@hanyang.ac.kr`로 끝나야 함 (아니면 거부) |
| 학번 형식 | 숫자 6~12자 |
| 비밀번호 | 8자 이상 |
| 학번 중복 | 409 "이미 가입된 학번입니다" |
| 이메일 중복 | 409 "이미 사용 중인 이메일입니다" |
| 정규화 | `2학년`→`2`, `2024년`→`2024` |

→ `User` 문서를 **학번(PK)** 으로 생성, 비밀번호는 scrypt 해시 저장.

### 파일
- 백엔드: `server/routes/auth.js`(signup)
- 프론트: `src/page/Signup/Signup.tsx`(1단계 한양 이메일 검증 + "가입 완료" → `signup()`), `src/api/api.ts`(`signup()`)

---

## 3. 구글 로그인 (Firebase Authentication)

### 엔드포인트
- `POST /api/auth/google` `{ idToken }` → 기존이면 `{ needsOnboarding:false, token, user }`, 신규면 `{ needsOnboarding:true, email, name }`
- `POST /api/auth/google/complete` `{ idToken, studentId, college, dept, grade, admYear }` → `{ token, user }`

### 로직
```
구글 버튼 → Firebase signInWithPopup(hd: hanyang.ac.kr) → Firebase ID 토큰
   → 백엔드가 admin.verifyIdToken()으로 검증 (진짜 구글 로그인인지)
   → 이메일이 @hanyang.ac.kr 인지 서버에서 재확인 (진짜 차단)
   → 기존 계정(이메일 일치) → 바로 로그인(JWT)
   → 신규 → "학번·학과·학년" 입력 모달 → /google/complete → 계정 생성 → 로그인
```
- 구글 계정은 `provider:'google'`, `password:''`(비번 없음), `emailVerified:true`(구글 인증), 프로필 사진은 구글 사진 사용.

### 파일
- 백엔드: `server/routes/auth.js`(google, google/complete)
- 프론트: `src/firebase.ts`(웹 config + `auth` export), `src/page/Login/login.tsx`(구글 버튼 + 학번 온보딩 모달), `src/api/api.ts`(`googleLogin`, `googleComplete`)

---

## 4. 인증 미들웨어 전환 (핵심 연결 고리)

`server/middleware/requireUser.js` 를 **헤더 학번 → JWT 검증**으로 교체:
```
[Before] x-student-id 헤더 → req.studentId   (로그인 없던 임시 방식)
[After]  Authorization: Bearer <JWT> 검증 → 토큰에서 req.studentId 추출
```
→ 이 한 파일만 바꿔서 **회원정보·키워드 등 보호된 API 전부가 "로그인한 사람" 기준**으로 동작.
→ 프론트 `api.ts`의 `authHeader()`도 `x-student-id` → `Authorization: Bearer`로 변경.

---

## 5. 로그인 도입에 맞춘 연동 수정

| # | 문제 | 수정 |
|---|---|---|
| 1 | 로그아웃해도 토큰이 안 지워져 실제 로그아웃 안 됨 | **6개 화면**(대시보드·회원설정·키워드·지도·알림·공지)의 로그아웃 버튼이 `logout()`(토큰 삭제) 호출 후 이동 |
| 2 | 비로그인 상태로 보호 페이지 직접 접근 가능 | `src/App.tsx`에 **`RequireAuth` 라우트 가드** — 토큰 없으면 `/login`으로 |
| 3 | 구글 계정은 비번이 없어 비번변경이 깨짐 | `setting.tsx`: `provider==='google'`이면 비번변경 대신 **"구글 계정으로 로그인하여 비밀번호가 없습니다"** 안내 |
| 4 | 사이드바 유저명이 "조에인"으로 하드코딩 | 회원설정 사이드바를 **로그인 유저의 이름·전공·사진**으로 동적 표시 (+ `api.ts`에 이름 저장/`getUserName()`) |
| 5 | 이메일 변경 시 구글 로그인이 깨짐 | 이메일 인증 모달의 입력을 **읽기전용(현재 이메일 고정)** → 이메일 변경 불가 |

---

## 6. 데이터 모델 (Firestore `User`, 문서ID=학번)

```jsonc
{
  "studentId": "2024000000",
  "name": "정하나",
  "email": "...@hanyang.ac.kr",
  "emailVerified": false,        // 구글 가입은 true
  "tel": "",
  "password": "<scrypt 해시>",    // 구글 계정은 "" (비번 없음)
  "provider": "local",           // 또는 "google"
  "searchCycle": "1주일",
  "major": "...", "college": "...", "dept": "...", "grade": "2", "admYear": "2024",
  "photoUrl": null,              // 구글은 구글 프로필 사진
  "notificationSettings": { "notice": true, "keyword": true, "map": true },
  "fcmTokens": [],
  "createdAt": "...", "updatedAt": "..."
}
```

---

## 7. 보안 메모
- 비밀번호: **scrypt 해시 + salt**, 평문 저장 안 함
- JWT 비밀키: `server/.env`의 `JWT_SECRET`(깃 제외), 만료 2시간
- 로그인 실패 메시지 통일 → 계정 열거 방지
- 구글 토큰: 서버에서 `verifyIdToken`으로 검증 + 도메인 재확인
- Firebase 웹 config(`firebase.ts`의 apiKey 등)는 **공개돼도 안전한 값**

## 8. 미완성 / 주의
- **rate-limit(로그인 시도 제한)** 은 이번 범위에서 제외
- **키워드 정렬·페이징**은 `git stash`에 보관 중(이 커밋에 미포함)
- 대시보드·키워드 등 **다른 페이지 사이드바는 아직 하드코딩**(회원설정만 동적)
- 전체 빌드는 조예인 `dashboard.tsx`(미사용 변수)로 막혀 있음 — 인증 코드와 무관

## 9. 추가된/수정된 파일
**백엔드(신규)**: `server/routes/auth.js`, `server/lib/jwt.js`
**백엔드(수정)**: `server/middleware/requireUser.js`, `server/index.js`, `server/.env`(JWT_SECRET), `server/package.json`(jsonwebtoken)
**프론트(수정)**: `src/App.tsx`, `src/api/api.ts`, `src/firebase.ts`, `src/page/Login/login.tsx`, `src/page/Signup/Signup.tsx`, `src/page/Setting/setting.tsx`, 그리고 로그아웃 수정으로 `Keyword/keyword.tsx`·`Notices/NoticesPage.tsx`·`Notification/NotificationPage.tsx`·`Dashboard/dashboard.tsx`·`Map/MapPage.tsx`
