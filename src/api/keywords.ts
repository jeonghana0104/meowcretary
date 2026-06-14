// ────────────────────────────────────────────────────────────
// 키워드 DB 함수 모음 (Firestore "keywords" 컬렉션과 연결)
//
// 구조:  keywords (컬렉션)
//          └─ 자동ID (문서)
//               ├─ name: "가을축제"
//               └─ createdAt: 2026-06-08 ...
// ────────────────────────────────────────────────────────────
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// 화면에서 쓸 키워드 타입 (Firestore 문서 ID는 문자열)
export type Keyword = {
  id: string;
  name: string;
};

// "keywords" 컬렉션(서랍) 참조
const keywordsCol = collection(db, 'keywords');

// 📤 [읽기] 키워드 전체 가져오기 (오래된 순)
export async function getKeywords(): Promise<Keyword[]> {
  const q = query(keywordsCol, orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    name: (d.data().name as string) ?? '',
  }));
}

// 📥 [추가] 키워드 1개 저장 → 새로 생긴 문서 ID 반환
export async function addKeyword(name: string): Promise<string> {
  const docRef = await addDoc(keywordsCol, {
    name,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// 🗑️ [삭제] 문서 ID로 키워드 삭제
export async function deleteKeyword(id: string): Promise<void> {
  await deleteDoc(doc(db, 'keywords', id));
}
