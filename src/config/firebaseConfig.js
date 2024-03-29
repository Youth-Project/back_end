import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as admin from 'firebase-admin';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your service account key
import serviceAccount from './serviceAccountKey.json';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZq36G0AMz4dh_hlVS7X9xY2aXGCZLmVo",
  authDomain: "youth-truffle.firebaseapp.com",
  projectId: "youth-truffle",
  storageBucket: "youth-truffle.appspot.com",
  messagingSenderId: "295038915158",
  appId: "1:295038915158:android:0f78a90b8721647520e1f7",
  databaseURL: "https://firestore.googleapis.com/v1/projects/youth-truffle/databases/(default)/documents",
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

try {
  setPersistence(auth, getReactNativePersistence(AsyncStorage));
} catch (error) {
  console.error('Error setting auth persistence:', error);
}

// Initialize Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Error initializing Admin SDK:', error);
}

export { firebaseApp, db, auth, admin, serviceAccount };
