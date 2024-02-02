// dbFunctions.js 이부분은 수정 필요할수도 있음!!

import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// 모든 사용자 가져오기
const getAllUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map((doc) => doc.data());
};

// 사용자 추가
const addUser = async (userData) => {
  const usersCollection = collection(db, 'users');
  await addDoc(usersCollection, userData);
};

// 사용자 정보 업데이트
const updateUser = async (userId, updatedData) => {
  const userDoc = doc(db, 'users', userId);
  await updateDoc(userDoc, updatedData);
};

// 사용자 삭제
const deleteUser = async (userId) => {
  const userDoc = doc(db, 'users', userId);
  await deleteDoc(userDoc);
};

export { getAllUsers, addUser, updateUser, deleteUser };
