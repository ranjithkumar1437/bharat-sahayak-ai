
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check whether configuration values are loaded.
// Never print the actual API key.
console.log("Firebase environment check:", {
  apiKeyLoaded: Boolean(firebaseConfig.apiKey),
  authDomainLoaded: Boolean(firebaseConfig.authDomain),
  projectIdLoaded: Boolean(firebaseConfig.projectId),
  storageBucketLoaded: Boolean(firebaseConfig.storageBucket),
  messagingSenderIdLoaded: Boolean(firebaseConfig.messagingSenderId),
  appIdLoaded: Boolean(firebaseConfig.appId),
  measurementIdLoaded: Boolean(firebaseConfig.measurementId),
});

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  throw new Error(
    "Firebase configuration missing. Check frontend environment variables."
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
