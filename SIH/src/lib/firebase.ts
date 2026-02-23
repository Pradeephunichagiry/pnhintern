// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace this with the config from your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyCAC51s5qF6bCr29AYpINslDFlsP02Ln4U",
  authDomain: "studio-7722921849-fff44.firebaseapp.com",
  projectId: "studio-7722921849-fff44",
  storageBucket: "studio-7722921849-fff44.firebasestorage.app",
  messagingSenderId: "928140452604",
  appId: "1:928140452604:web:930e760ca28925c0c92d79"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
