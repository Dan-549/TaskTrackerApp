// Import the functions you need from the SDKs you need

import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyD9anuEHR2AMZAllQ8HN_fRm57azsBaa2g",

  authDomain: "tasktrackerapp-b4b8f.firebaseapp.com",

  projectId: "tasktrackerapp-b4b8f",

  storageBucket: "tasktrackerapp-b4b8f.firebasestorage.app",

  messagingSenderId: "611626056763",

  appId: "1:611626056763:web:c2e79028fc20a39d3c701e"

};


// Initialize Firebase
let firebaseApp: FirebaseApp;
try {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } else {
    firebaseApp = getApps()[0];
    console.log("Firebase already initialized");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

// Initialize Firebase Authentication
let auth: Auth;
try {
  auth = getAuth(firebaseApp);
  console.log("Firebase Auth initialized successfully");
} catch (error) {
  console.error("Firebase Auth initialization error:", error);
  throw error;
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Initialize Firestore
let db: Firestore;
try {
  db = getFirestore(firebaseApp);
  console.log("Firestore initialized successfully");
} catch (error) {
  console.error("Firestore initialization error:", error);
  throw error;
}

export { auth, db, firebaseApp, googleProvider };

