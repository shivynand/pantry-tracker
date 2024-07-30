// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1lWs7r6l8MKRcYIExsN9lZ2BL3Y1V7KQ",
  authDomain: "pantry-tracker-c3672.firebaseapp.com",
  projectId: "pantry-tracker-c3672",
  storageBucket: "pantry-tracker-c3672.appspot.com",
  messagingSenderId: "308636174498",
  appId: "1:308636174498:web:42ba55240877efba46affb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);