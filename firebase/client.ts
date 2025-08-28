import { initializeApp , getApp, getApps} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAJFZOjyB8ulSHa3RpPnFs2dqQctsI_B3I",
  authDomain: "prepwise-ae6e5.firebaseapp.com",
  projectId: "prepwise-ae6e5",
  storageBucket: "prepwise-ae6e5.firebasestorage.app",
  messagingSenderId: "8267534548",
  appId: "1:8267534548:web:abdd90f53be6b217f4eb41",
  measurementId: "G-B6SFNMZ0CD"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);