import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig } from "./constants";
export const app = firebase.initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
