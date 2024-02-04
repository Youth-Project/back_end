// dbFunctions.js 이부분은 수정 필요할수도 있음!!

import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// 모든 사용자 가져오기
// 이건 우리가 사용자들 관리할때 쓸 수 있는 함수. 관리자권한의 계정에서 사용 가능
const getAllUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map((doc) => doc.data());
};

// 사용자 추가
//인풋으로 사용자 이메일과 비밀번호를 userData로 받음
const addUser = async (userData) => {
  const usersCollection = collection(db, 'users');
  await addDoc(usersCollection, userData);
};

// 사용자 정보 업데이트
// 인풋으로 업데이트할 사용자 id랑 updatedData에서 업데이트 항목을 변수로 받음. 예를들면 비밀번호나 그 소비 목표 금액 수정할때 쓸 수 있을듯
const updateUser = async (userId, updatedData) => {
  const userDoc = doc(db, 'users', userId);
  await updateDoc(userDoc, updatedData);
};

// 사용자 삭제
// 사용자가 탈퇴할때 쓰는 걸로 인풋으로는 user의 id를 받아서 db에서 삭제
const deleteUser = async (userId) => {
  const userDoc = doc(db, 'users', userId);
  await deleteDoc(userDoc);
};

export { getAllUsers, addUser, updateUser, deleteUser };
