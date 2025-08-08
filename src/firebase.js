// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA78T27u9OC0AQQaWhlDORbwMCLF7-t_Pw",
    authDomain: "event-organizer-577c3.firebaseapp.com",
    projectId: "event-organizer-577c3",
    storageBucket: "event-organizer-577c3.firebasestorage.app",
    messagingSenderId: "931526045104",
    appId: "1:931526045104:web:18b77ec13b71fbf2f9ba75"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
