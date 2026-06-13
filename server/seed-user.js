// 테스트용 User 문서 1개 생성 (로그인/회원가입이 아직 없으므로 수동 시드)
// 실행: npm run seed
import { FieldValue } from 'firebase-admin/firestore';
import { db } from './firebase.js';
import { hashPassword } from './lib/password.js';

const studentId = '2024000000';

const user = {
  studentId,                                   // ID(학번) — PK
  name: '정하나',                               // Name
  email: 'jeonghan0104@hanyang.ac.kr',         // Email
  tel: '010-0000-0000',                        // Terl(전화번호)
  password: hashPassword('test1234'),          // Password(해시)
  searchCycle: '1주일',                         // SearchCycle
  // --- 프론트(setting.tsx)가 쓰는 확장 필드 (ERD엔 없지만 화면에 필요) ---
  major: '스마트ICT융합 전공',
  college: 'ICT융합대학',
  dept: '스마트융합공학부',
  grade: '2',
  admYear: '2024',
  photoUrl: null,                              // 프로필 사진 (Storage URL)
  emailVerified: false,                        // 이메일 인증 여부
  notificationSettings: {                      // 알림 카테고리별 설정
    notice: true,                              //  - 공지
    keyword: true,                             //  - 키워드
    map: true,                                 //  - 지도
  },
  fcmTokens: [],                               // FCM 기기 토큰 목록
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
};

await db.collection('User').doc(studentId).set(user, { merge: true });
console.log(`✅ 테스트 User 생성 완료 → User/${studentId} (비번: test1234)`);
process.exit(0);
