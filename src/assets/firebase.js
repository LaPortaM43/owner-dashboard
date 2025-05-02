// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Website
const webConfig = {
  apiKey: "AIzaSyAsOo8Z83jXJNhP46fp2w2_ao28ik9kiWI",
  authDomain: "slushie-bdf60.firebaseapp.com",
  projectId: "slushie-bdf60",
  storageBucket: "slushie-bdf60.firebasestorage.app",
  messagingSenderId: "192304780991",
  appId: "1:192304780991:web:387c81896bacea3016580a",
  measurementId: "G-XRM0K39ZM6"
};

// Android
const androidConfig = {
  apiKey: "AIzaSyDHeWd4ykx41_rVJLgD0rqGDa97g7ditb0",
  authDomain: "slushie-f9b5e.firebaseapp.com",
  projectId: "slushie-f9b5e",
  storageBucket: "slushie-f9b5e.firebasestorage.app",
  messagingSenderId: "253577986339",
  appId: "1:253577986339:android:967644dd6ead3f01744c96",
};

const webApp = initializeApp(webConfig); 
const androidApp = initializeApp(androidConfig, "android"); 


export const webDB = getFirestore(webApp);
export const androidDB = getFirestore(androidApp);

export const auth = getAuth(webApp);

