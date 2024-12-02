import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage, deleteObject } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAATLTwS-yxSngFAHjg-kn-enmAln5b82E",
  authDomain: "trashtrack-ac6eb.firebaseapp.com",
  projectId: "trashtrack-ac6eb",
  storageBucket: "trashtrack-ac6eb.appspot.com",
  messagingSenderId: "206696705800",
  appId: "1:206696705800:web:6d3d8814663d90123446bd",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

export {
  auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  db,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
  getDoc,
  functions,
  setDoc,
  storage,
  deleteObject,
  updateDoc,
  query,
  where,
  writeBatch,
};
