import type { Auth, GoogleAuthProvider } from "firebase/auth";

// firebase/app 與 firebase/auth 皆由呼叫端動態 import，不進首屏 bundle。
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// SDK 內部的儲存格式（key：firebase:<key>:<apiKey>:<appName>）；升級 firebase 須確認未變，
// 否則 mayHaveStoredSession 恆回 false，已登入使用者會被當成訪客
const AUTH_USER_KEY = `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`;
const PENDING_REDIRECT_KEY = `firebase:pendingRedirect:${firebaseConfig.apiKey}:[DEFAULT]`;
const IDB_NAME = "firebaseLocalStorageDb";
const IDB_STORE = "firebaseLocalStorage";

/** 讀 Web Storage；隱私模式等環境存取即 throw，一律視為不存在 */
const hasStorageItem = (getStorage: () => Storage, key: string): boolean => {
  try {
    return getStorage().getItem(key) !== null;
  } catch {
    return false;
  }
};

/** 本分頁是否有進行中的 redirect 登入（signInWithRedirect 發起時 SDK 寫入 sessionStorage） */
export const hasPendingRedirect = (): boolean =>
  typeof window !== "undefined" &&
  hasStorageItem(() => window.sessionStorage, PENDING_REDIRECT_KEY);

/** 查 SDK 的 IndexedDB 是否存有登入使用者；不會建立不存在的資料庫 */
const idbHasAuthUser = async (): Promise<boolean> => {
  if (typeof indexedDB.databases !== "function") return true;
  const dbs = await indexedDB.databases();
  if (!dbs.some((db) => db.name === IDB_NAME)) return false;
  return new Promise((resolve) => {
    let creating = false;
    const request = indexedDB.open(IDB_NAME);
    request.onupgradeneeded = () => {
      creating = true;
      request.transaction?.abort();
    };
    request.onerror = () => resolve(!creating);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.close();
        resolve(false);
        return;
      }
      try {
        const count = db
          .transaction(IDB_STORE, "readonly")
          .objectStore(IDB_STORE)
          .count(AUTH_USER_KEY);
        count.onsuccess = () => {
          db.close();
          resolve(count.result > 0);
        };
        count.onerror = () => {
          db.close();
          resolve(true);
        };
      } catch {
        db.close();
        resolve(true);
      }
    };
  });
};

/**
 * 本機是否可能存有登入 session（依序查 SDK 的三種 persistence）。
 * 判斷不了時（不支援 indexedDB.databases、讀取失敗）一律回 true，退回載入 SDK 確認。
 */
export const mayHaveStoredSession = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  if (
    hasStorageItem(() => window.localStorage, AUTH_USER_KEY) ||
    hasStorageItem(() => window.sessionStorage, AUTH_USER_KEY)
  ) {
    return true;
  }
  if (typeof indexedDB === "undefined") return false;
  try {
    return await idbHasAuthUser();
  } catch {
    return true;
  }
};

let authPromise: Promise<{
  auth: Auth;
  googleProvider: GoogleAuthProvider;
}> | null = null;

/** firebase/auth 是否已開始載入（之後的查詢可直接取 currentUser） */
export const isFirebaseAuthLoaded = (): boolean => authPromise !== null;

/**
 * 動態載入 firebase/auth 並初始化（全頁單例，首次呼叫的參數決定設定）。
 * popup / redirect resolver 只在要登入或 redirect 導回時才掛上：掛上後手機與 Safari 會主動載入
 * auth iframe（popup 須先備妥才能在點擊當下開窗），已登入的一般瀏覽不需要它。
 */
export const loadFirebaseAuth = ({ forLogin = false } = {}) => {
  authPromise ??= (async () => {
    const [{ getApps, initializeApp }, firebaseAuth] = await Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
    ]);
    const app = getApps()[0] ?? initializeApp(firebaseConfig);
    const withResolver = forLogin || hasPendingRedirect();
    let auth: Auth;
    try {
      // persistence 順序須與 getAuth() 預設相同，否則既有登入讀不到
      auth = firebaseAuth.initializeAuth(app, {
        persistence: [
          firebaseAuth.indexedDBLocalPersistence,
          firebaseAuth.browserLocalPersistence,
          firebaseAuth.browserSessionPersistence,
        ],
        ...(withResolver && {
          popupRedirectResolver: firebaseAuth.browserPopupRedirectResolver,
        }),
      });
    } catch {
      // dev HMR 重新執行本模組時 auth 已初始化
      auth = firebaseAuth.getAuth(app);
    }
    return { auth, googleProvider: new firebaseAuth.GoogleAuthProvider() };
  })().catch((error) => {
    // chunk 載入失敗（離線等）時允許下次重試
    authPromise = null;
    throw error;
  });
  return authPromise;
};
