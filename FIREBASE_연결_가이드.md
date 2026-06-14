# 🔥 Firebase 연결 가이드 (Cloud Functions + DB) — 왕초보용

이 문서는 `meowcretary` 프로젝트에 Firebase를 붙이는 방법을 **처음 하는 사람도 따라할 수 있게** 순서대로 설명합니다.
중간에 막히면 "자주 하는 실수" 섹션부터 보세요.

> 📖 **이 문서(.md)를 예쁘게 보는 법 (VS Code)**
> 지금처럼 기호(`#`, `|`)가 그대로 보이면 "원본" 상태예요. 렌더링해서 보려면:
> - `Ctrl + Shift + V` → 미리보기 화면 단독으로 열기 (추천)
> - `Ctrl + K` 누른 뒤 `V` → 코드/미리보기 나란히 보기
> - 또는 파일 탭을 **우클릭 → Open Preview**

---

## 0. 가장 먼저 — "마스터키"가 뭔지 이해하기 (꼭 읽기)

방금 받은 파일:
```
meowcretary-firebase-adminsdk-fbsvc-6d634af0a5.json
```
이건 **"Admin SDK 서비스 계정 키"** 입니다. 쉽게 말해 **우리 Firebase 프로젝트의 마스터키(만능 열쇠)** 예요.

Firebase에는 열쇠가 **2종류** 있습니다. 이걸 헷갈리면 사고가 납니다.

| 종류 | 어디서 쓰나 | 공개해도 되나 | 우리 파일 |
|------|------------|--------------|----------|
| **Client SDK 설정** (apiKey, authDomain...) | 프론트엔드 (React, 브라우저) | ✅ 공개 OK (원래 브라우저에 노출됨) | 콘솔에서 따로 복사 |
| **Admin SDK 키** (이 JSON 파일) | **서버(Cloud Functions)에서만** | ❌ 절대 공개 금지 | `...adminsdk...json` |

> 🚨 **이 JSON 파일을 절대 하면 안 되는 것**
> - ❌ React(`src/`) 코드 안에 import 하기 → 브라우저에 마스터키가 그대로 노출됨
> - ❌ git에 commit / push 하기 → GitHub에 올라가면 전 세계가 봄
> - ❌ 카톡/메일로 막 보내기 (이미 카톡으로 받았으니, 실서비스라면 키를 새로 발급받는 게 안전)

✅ **이미 안전 조치 완료:** 이 파일명은 `.gitignore`에 등록되어 있어서 git에 안 올라갑니다.
직접 확인하려면:
```powershell
git check-ignore meowcretary-firebase-adminsdk-fbsvc-6d634af0a5.json
```
파일명이 그대로 출력되면 = "git이 무시하는 중" = 안전.

---

## 1. 전체 그림 이해하기

우리가 만들 구조는 이렇습니다:

```
[ 브라우저 / React 앱 ]   ←  사용자가 보는 화면 (src/ 폴더)
        │
        │  ① Client SDK로 직접 DB 읽기/쓰기 (간단한 건 이걸로)
        │  ② 복잡하거나 보안 필요한 건 함수 호출
        ▼
[ Cloud Functions ]       ←  서버에서 도는 코드 (functions/ 폴더, 새로 만듦)
        │  Admin SDK(마스터키) 사용
        ▼
[ Firestore (DB) ]        ←  데이터 저장소 (구글 클라우드)
```

- **Firestore** = 데이터베이스 (고양이 위치, 사용자 정보 등 저장)
- **Cloud Functions** = 서버 코드 (예: "고양이 제보가 들어오면 검증 후 저장")
- **Admin SDK 키** = Functions가 DB를 마음대로 다룰 수 있게 해주는 마스터키

---

## 2. 준비물 설치 (한 번만)

### 2-1. Node.js 확인
```powershell
node -v
```
v18 이상이면 OK. 없으면 https://nodejs.org 에서 LTS 버전 설치.

### 2-2. Firebase CLI(명령어 도구) 설치
```powershell
npm install -g firebase-tools
```

### 2-3. 로그인
```powershell
firebase login
```
→ 브라우저가 열리고 구글 로그인하면 됨. **이 프로젝트(`meowcretary`)를 만든 구글 계정**으로 로그인하세요.

---

## 3. Firestore 데이터베이스 만들기 (콘솔에서, 클릭만)

1. https://console.firebase.google.com 접속
2. `meowcretary` 프로젝트 선택
3. 왼쪽 메뉴 → **빌드(Build) → Firestore Database** 클릭
4. **데이터베이스 만들기** 버튼
5. 위치(location)는 `asia-northeast3 (서울)` 추천
6. 모드는 일단 **테스트 모드(test mode)**로 시작 → 개발 중엔 편함
   > ⚠️ 테스트 모드는 30일 후 아무나 못 쓰게 잠깁니다. 나중에 "보안 규칙"을 제대로 설정해야 함(8번 참고).

---

## 4. 프로젝트에 Firebase 연결하기 (Functions 만들기)

프로젝트 폴더(`C:\code\meowcretary`)에서 터미널을 열고:

```powershell
firebase init
```

화살표/스페이스바로 선택합니다. 이렇게 고르세요:

1. **어떤 기능?** → `Functions` 와 `Firestore` 를 스페이스바로 체크 → 엔터
2. **프로젝트?** → `Use an existing project` → `meowcretary` 선택
3. **Functions 언어?** → **TypeScript** 추천 (이 프로젝트가 이미 TS라서 통일됨)
4. **ESLint 쓸래?** → `Yes`
5. **지금 npm install?** → `Yes`
6. Firestore 규칙 파일(`firestore.rules`) → 기본값 엔터

끝나면 폴더가 이렇게 생깁니다:
```
meowcretary/
├─ src/                 ← 기존 React 앱
├─ functions/           ← ✨ 새로 생김! 서버 코드 자리
│   ├─ src/index.ts     ← 여기에 함수 작성
│   └─ package.json
├─ firebase.json        ← ✨ Firebase 설정
├─ firestore.rules      ← ✨ DB 보안 규칙
└─ .firebaserc          ← ✨ 어떤 프로젝트인지 기록
```

---

## 5. Cloud Function 첫 코드 작성 (Admin SDK로 DB 다루기)

`functions/src/index.ts` 파일을 열어서 아래 내용으로 바꿔보세요.
**고양이 제보를 DB에 저장하는 함수**와 **목록을 읽는 함수** 예제입니다.

```typescript
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// 🔑 Admin SDK 초기화
// ✅ Firebase에 "배포"하면 마스터키 파일이 필요 없습니다!
//    Cloud Functions 환경이 자동으로 권한을 줍니다.
admin.initializeApp();

const db = admin.firestore();

// 📥 [쓰기] 고양이 제보 저장하기
// 호출: POST /addCat   body: { "name": "치즈", "lat": 37.5, "lng": 127.0 }
export const addCat = onRequest(async (req, res) => {
  const { name, lat, lng } = req.body;

  const docRef = await db.collection("cats").add({
    name,
    lat,
    lng,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.json({ ok: true, id: docRef.id });
});

// 📤 [읽기] 고양이 목록 가져오기
// 호출: GET /getCats
export const getCats = onRequest(async (req, res) => {
  const snapshot = await db.collection("cats").get();
  const cats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(cats);
});
```

> 💡 **마스터키 JSON 파일은 언제 쓰나요?**
> - **배포된 Functions** → 안 씀 (`admin.initializeApp()`이 자동 처리). 이게 정석.
> - **내 PC에서 따로 Node 스크립트 돌릴 때** → 그때만 씀 (아래 9번 참고).
> 그래서 평소엔 이 키 파일을 코드에서 직접 부를 일이 거의 없습니다. 안전하게 보관만 하면 됨.

---

## 6. 로컬에서 테스트 (에뮬레이터 — 진짜 배포 전에 내 PC에서 미리 돌려보기)

```powershell
firebase emulators:start
```
- 터미널에 나오는 주소(예: `http://127.0.0.1:5001/...`)로 함수가 뜹니다.
- `http://127.0.0.1:4000` → 에뮬레이터 대시보드(DB 내용을 눈으로 확인 가능).

테스트 호출 예 (PowerShell):
```powershell
# 고양이 추가
curl.exe -X POST "http://127.0.0.1:5001/meowcretary/asia-northeast3/addCat" `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"치즈\",\"lat\":37.5,\"lng\":127.0}'

# 목록 보기
curl.exe "http://127.0.0.1:5001/meowcretary/asia-northeast3/getCats"
```
> 주소의 `asia-northeast3` 부분은 실제 출력된 주소에 맞춰 바꾸세요.

---

## 7. 실제로 배포하기

```powershell
firebase deploy --only functions
```
- 처음 배포할 땐 Firebase가 **요금제(Blaze, 종량제)** 업그레이드를 요구할 수 있습니다.
  Functions는 무료(Spark) 요금제에선 외부 호출이 안 돼서 Blaze로 바꿔야 해요.
  → **Blaze도 사용량이 적으면 거의 0원**입니다(무료 할당량 큼). 카드 등록만 필요.

배포 끝나면 `https://asia-northeast3-meowcretary.cloudfunctions.net/getCats` 같은 진짜 주소가 생깁니다.

---

## 8. 프론트엔드(React)에서 사용하기

여기서부턴 **마스터키가 아니라 "Client SDK 설정"**을 씁니다 (공개되어도 안전한 그것).

### 8-1. 클라이언트 설정값 가져오기
콘솔 → ⚙️ 프로젝트 설정 → "내 앱" → 웹 앱(`</>`) → `firebaseConfig` 객체 복사.
(없으면 "앱 추가 → 웹" 클릭해서 만들면 됨.)

### 8-2. 패키지 설치
```powershell
npm install firebase
```

### 8-3. 설정 파일 만들기 — `src/firebase.ts`
```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 콘솔에서 복사한 값 붙여넣기 (이건 공개되어도 안전한 값)
const firebaseConfig = {
  apiKey: "여기에_복사",
  authDomain: "meowcretary.firebaseapp.com",
  projectId: "meowcretary",
  storageBucket: "meowcretary.appspot.com",
  messagingSenderId: "여기에_복사",
  appId: "여기에_복사",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 8-4. 방법 A — 프론트에서 DB 직접 읽기 (간단한 경우)
```typescript
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

async function loadCats() {
  const snapshot = await getDocs(collection(db, "cats"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
```
> 지금 `src/data/mockData.ts`로 가짜 데이터를 쓰고 있는데, 이걸 위 `loadCats()`로 바꾸면 진짜 DB와 연결됩니다.

### 8-5. 방법 B — Cloud Function 호출 (검증/보안이 필요한 경우)
```typescript
async function addCat(name: string, lat: number, lng: number) {
  const res = await fetch(
    "https://asia-northeast3-meowcretary.cloudfunctions.net/addCat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lat, lng }),
    }
  );
  return res.json();
}
```

> **언제 A, 언제 B?**
> - 단순 조회/저장 → **A (직접)** 가 빠르고 쉬움
> - "신고 5번 이상이면 자동 숨김", "관리자만 삭제" 같은 **신뢰가 필요한 로직** → **B (함수)**

---

## 9. (선택) 내 PC에서 마스터키로 직접 스크립트 돌리기

배포 없이, 내 컴퓨터에서 1회성 작업(예: 초기 데이터 대량 입력)을 할 때만 마스터키 파일을 직접 씁니다.

`scripts/seed.mjs` 같은 파일을 만들고:
```javascript
import admin from "firebase-admin";
import { readFileSync } from "fs";

// 🔑 마스터키 파일 직접 읽기 (이 코드는 절대 배포/브라우저로 안 감, 내 PC 전용)
const key = JSON.parse(
  readFileSync("./meowcretary-firebase-adminsdk-fbsvc-6d634af0a5.json", "utf8")
);

admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

await db.collection("cats").add({ name: "테스트냥", lat: 37.5, lng: 127.0 });
console.log("입력 완료!");
process.exit(0);
```
실행:
```powershell
node scripts/seed.mjs
```
> ⚠️ 이런 스크립트 파일도 git에 올릴 때 키 경로가 노출되지 않게 주의. 키 파일 자체는 이미 gitignore 처리됨.

---

## 10. 보안 규칙(중요) — 아무나 DB 못 건드리게

`firestore.rules` 파일이 DB 출입문입니다. 테스트 모드는 30일 후 잠기니, 최소한 이 정도로 바꾸세요:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cats/{catId} {
      allow read: if true;              // 누구나 고양이 목록은 볼 수 있음
      allow write: if request.auth != null;  // 로그인한 사람만 쓰기 가능
    }
  }
}
```
적용:
```powershell
firebase deploy --only firestore:rules
```
> 로그인 기능(Firebase Auth)을 아직 안 만들었다면 `allow write: if true;`로 두되, **실서비스 전엔 꼭 잠가야** 합니다.

---

## 📊 (중요) 내가 올린 데이터가 어떻게 저장되고, 어디서 보나?

이 부분이 질문하신 핵심이에요. Firebase에 데이터를 넣으면 **Firestore**라는 DB에 저장되는데,
저장 구조와 "눈으로 확인하는 법"을 설명할게요.

### A. Firestore가 데이터를 저장하는 구조 (개념)

Firestore는 엑셀처럼 표(table)가 아니라 **"폴더 안에 카드"** 구조입니다. 용어 3개만 외우면 됩니다:

```
컬렉션(Collection)   =  서랍/폴더   (예: "cats")
   └─ 문서(Document)  =  카드 1장    (고양이 1마리, 자동 ID 부여)
        └─ 필드(Field) =  카드 속 항목 (name, lat, lng, createdAt ...)
```

실제로 우리 `addCat` 함수로 고양이를 넣으면 이렇게 쌓입니다:

```
cats   (컬렉션 = 서랍)
 ├─ 8a3Kf9zQ...  (문서 = 카드, 자동 생성된 ID)
 │    ├─ name: "치즈"
 │    ├─ lat: 37.5
 │    ├─ lng: 127.0
 │    └─ createdAt: 2026년 6월 8일 14:03
 ├─ Lp02mWx...   (또 다른 고양이)
 │    ├─ name: "까망이"
 │    └─ ...
 └─ ...
```

- `cats` ← `db.collection("cats")` 의 `"cats"` 가 바로 이 서랍 이름
- 문서 ID(`8a3Kf9zQ...`) ← `.add()`로 넣으면 Firebase가 **자동으로** 만들어 줌
- 내가 ID를 직접 정하고 싶으면 `.doc("내가정한ID").set({...})` 사용

### B. 콘솔에서 내 데이터 직접 보기 (가장 많이 씀) 👀

1. https://console.firebase.google.com 접속 → `meowcretary` 선택
2. 왼쪽 메뉴 → **빌드(Build) → Firestore Database**
3. **"데이터(Data)"** 탭을 보면 위 그림 그대로 화면에 나옵니다:
   - 왼쪽: 컬렉션 목록(`cats`) → 가운데: 문서 목록 → 오른쪽: 그 문서의 필드 값
4. 여기서 **직접 클릭으로** 값을 고치거나, 문서를 추가/삭제할 수도 있어요 (테스트할 때 편함).
5. 데이터가 많으면 위쪽 **필터(Filter)** 로 검색 가능.

> 💡 즉, "내가 올린 데이터가 진짜 들어갔나?" 를 확인하고 싶을 땐 **항상 이 Data 탭**을 보면 됩니다.

### C. 로컬 테스트(에뮬레이터)로 넣은 데이터 보기

`firebase emulators:start`로 테스트했을 때 넣은 데이터는 **진짜 DB가 아니라 내 PC 안**에만 있습니다.
이건 콘솔이 아니라 에뮬레이터 화면에서 봐요:

- 브라우저에서 `http://127.0.0.1:4000` 접속 → **Firestore 탭** 클릭 → 위 Data 탭과 똑같이 보임
- ⚠️ 에뮬레이터를 끄면 이 데이터는 **사라집니다** (연습용이라 그래요). 진짜 저장은 배포 후 콘솔 Data 탭에 남음.

### D. 코드에서 데이터 읽어와 확인하기

화면(앱)에서 직접 확인하려면 8-4의 `loadCats()`를 쓰면 됩니다.
브라우저 개발자도구(F12) → Console 에서 결과를 찍어볼 수도 있어요:

```typescript
loadCats().then((cats) => console.log("DB에 저장된 고양이들:", cats));
```

### E. "누가 언제 얼마나 썼는지" 사용량/로그 보기

- **함수가 실행됐는지, 에러났는지** → 콘솔 → **빌드 → Functions → "로그(Logs)"** 탭
- **DB 읽기/쓰기 횟수, 요금** → 콘솔 → **사용량 및 청구(Usage and billing)**
- Firestore는 "읽은 문서 수 / 쓴 문서 수" 단위로 과금돼요. 무료 할당량이 넉넉해서 연습 땐 거의 0원.

---

## 🧩 (참고) Firebase 다른 기능들 — 뭐가 있는지 전체 그림

지금은 **Firestore(DB) + Functions(서버)** 만 쓰지만, Firebase에는 이런 게 더 있습니다.
나중에 필요할 때 찾아 쓰세요. (콘솔 왼쪽 메뉴에 다 있음)

| 기능 | 한 줄 설명 | meowcretary에서 언제 쓸까 |
|------|-----------|--------------------------|
| **Authentication** | 회원가입/로그인 (구글, 이메일 등) | "로그인한 사람만 고양이 제보" 만들 때 |
| **Firestore Database** | 메인 DB (지금 쓰는 것) | 고양이 위치/정보 저장 |
| **Storage** | 이미지·파일 저장소 | 고양이 **사진** 업로드할 때 |
| **Hosting** | 만든 React 앱을 인터넷에 배포 | `npm run build` 결과를 세상에 공개할 때 |
| **Cloud Functions** | 서버 코드 (지금 쓰는 것) | 검증·알림 등 서버 로직 |
| **Cloud Messaging(FCM)** | 푸시 알림 | "내 동네 새 고양이 알림" 보낼 때 |
| **Analytics** | 사용자 통계 | 어떤 화면을 많이 보는지 분석 |

> 우리 앱 흐름에 자연스러운 다음 단계는 보통:
> **① Firestore 연결(지금) → ② 고양이 사진 = Storage → ③ 로그인 = Authentication → ④ 앱 공개 = Hosting** 순서예요.

### 앱(React)을 인터넷에 올리고 싶다면 (Hosting 맛보기)
```powershell
npm run build              # dist/ 폴더에 결과물 생성
firebase init hosting      # 한 번만: 공개할 폴더로 dist 지정
firebase deploy --only hosting
```
끝나면 `https://meowcretary.web.app` 같은 주소로 전 세계 누구나 접속 가능.

---

## 11. 자주 하는 실수 체크리스트 ✅

- [ ] 마스터키 JSON을 `src/`(React) 안에 import 하지 않았나? → **하면 안 됨**
- [ ] `git status`에 키 파일이 안 보이나? → 보이면 gitignore 문제. (지금은 정상)
- [ ] `firebase login` 한 계정이 `meowcretary` 프로젝트 소유자 계정 맞나?
- [ ] 배포된 함수인데 키 파일을 `cert(key)`로 직접 넣고 있진 않나? → 배포본은 `initializeApp()`만으로 충분
- [ ] Functions 배포가 "Blaze 요금제" 때문에 막혔나? → 종량제 업그레이드(소량은 거의 무료)
- [ ] Firestore 보안 규칙이 30일 후 잠기는 테스트 모드 그대로인가? → 10번으로 수정

---

## 12. 추천 진행 순서 (요약)

1. `firebase login`
2. 콘솔에서 Firestore DB 생성 (3번)
3. `firebase init` → Functions + Firestore (4번)
4. `functions/src/index.ts`에 예제 코드 (5번)
5. `firebase emulators:start`로 로컬 테스트 (6번)
6. `npm install firebase` + `src/firebase.ts` 만들어 프론트 연결 (8번)
7. 잘 되면 `firebase deploy` (7번)
8. 보안 규칙 잠그기 (10번)

막히는 단계가 있으면 그 번호 알려주시면 같이 봐드릴게요. 🐱
