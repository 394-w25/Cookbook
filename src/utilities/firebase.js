import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";
import {getStorage} from 'firebase/storage';
import { collection, getDocs } from "firebase/firestore"; 
import { get } from "firebase/database";

const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "AUTH_DOMAIN",
    projectId: "PROJECT_ID",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MESSAGING_SENDER_ID",
    appId: "APP_ID",
    measurementId: "MEASUREMENT_ID"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export const db = getFirestore(app);

// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Only initialize analytics if running in a browser -- this is for dataInsertion.js
// We probably don't need this for the final project
export let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const signInWithGoogle = async () => {
  try{
    setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log(user);
    return {user};
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
}