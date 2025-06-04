// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyDBUZYeCCsy1kOYbDbwBBmy_Mm7hlVjRJ4",

  authDomain: "tasktrackerapp-b4b8f.firebaseapp.com",

  projectId: "tasktrackerapp-b4b8f",

  storageBucket: "tasktrackerapp-b4b8f.firebasestorage.app",

  messagingSenderId: "611626056763",

  appId: "1:611626056763:web:c2e79028fc20a39d3c701e"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
