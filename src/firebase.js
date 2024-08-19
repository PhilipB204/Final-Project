// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCWQAbuxW0FarJPARhKrB__zPzIm0Rhv5U",
    authDomain: "final-project-50427.firebaseapp.com",
    databaseURL: "https://final-project-50427-default-rtdb.firebaseio.com",
    projectId: "final-project-50427",
    storageBucket: "final-project-50427.appspot.com",
    messagingSenderId: "597304298763",
    appId: "1:597304298763:web:6853ad92c40e677fd5a60e",
    measurementId: "G-SPGSQG97XH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
