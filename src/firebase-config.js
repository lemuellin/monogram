import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCoXa2IjdG9iPj9rc3hbd3JyBcOIf-27ks",
  authDomain: "instaclone-development.firebaseapp.com",
  projectId: "instaclone-development",
  storageBucket: "instaclone-development.appspot.com",
  messagingSenderId: "126856803443",
  appId: "1:126856803443:web:41fe856585d4db370ee606",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);