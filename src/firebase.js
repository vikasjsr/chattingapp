import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAkKmNL8DBJ54NOdyLJv9sXFVX7YKPmd3Y",
  authDomain: "sirfchattting.firebaseapp.com",
  projectId: "sirfchattting",
  storageBucket: "sirfchattting.appspot.com",
  messagingSenderId: "838857829300",
  appId: "1:838857829300:web:1dd7705815172a750de0e1"
};

export const app = initializeApp(firebaseConfig);