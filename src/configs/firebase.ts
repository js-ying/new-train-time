import { FirebaseApp, getApps, initializeApp } from "firebase/app";

// Firebase config 維持靜態載入（純物件，不會觸發 auth chunk）。
// 真正會撐肥 bundle 的 firebase/auth 改由呼叫端動態 import，避免首屏載入它。
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** 取得（或初次建立）Firebase App，避免重複初始化。 */
export const getFirebaseApp = (): FirebaseApp => {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
};

/**
 * 動態載入 firebase/auth + 取得 auth/googleProvider 實例。
 * 將 firebase/auth (~80KB gzip) 從 main bundle 抽出來，
 * 改成「使用者真的需要登入相關功能時」才載入的非同步 chunk。
 */
export const loadFirebaseAuth = async () => {
  const [{ getAuth, GoogleAuthProvider }] = await Promise.all([
    import("firebase/auth"),
  ]);
  const app = getFirebaseApp();
  return {
    auth: getAuth(app),
    googleProvider: new GoogleAuthProvider(),
  };
};
