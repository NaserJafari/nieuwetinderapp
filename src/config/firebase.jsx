// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgQESprtdjcNUEsT2YRVHs_hF-S4cD88U",
  authDomain: "firetinder-e8f27.firebaseapp.com",
  projectId: "firetinder-e8f27",
  storageBucket: "firetinder-e8f27.appspot.com",
  messagingSenderId: "57826430488",
  appId: "1:57826430488:web:9a7becc8e7164f05403d6d",
  measurementId: "G-XCBMLRSZFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, storage, provider, analytics };