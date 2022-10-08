import {initializeApp} from "firebase/compat/app";
import {getAuth} from "firebase/compat/auth";
import {getFirestore} from "firebase/compat/firestore";
import {getStorage} from "firebase/compat/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "react-firebase-component-8d8a5.firebaseapp.com",
  projectId: "react-firebase-component-8d8a5",
  storageBucket: "react-firebase-component-8d8a5.appspot.com",
  messagingSenderId: "621000305877",
  appId: "1:621000305877:web:9f70b53d8d70983800865c",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
