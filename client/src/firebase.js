// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hireme-3de62.firebaseapp.com",
  projectId: "hireme-3de62",
  storageBucket: "hireme-3de62.appspot.com",
  messagingSenderId: "568763654690",
  appId: "1:568763654690:web:5b2539bc1d321146eca07b",
  measurementId: "G-SJ4Z16QSGW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
