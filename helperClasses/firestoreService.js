import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import{getAuth} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

// import { doc, setDoc } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDkJbt9ewyYvPLb5LJDpDAFIaIvva9iaec",
  authDomain: "freshpicks-da3ef.firebaseapp.com",
  projectId: "freshpicks-da3ef",
  storageBucket: "freshpicks-da3ef.appspot.com",
  messagingSenderId: "610098249496",
  appId: "1:610098249496:web:0475aa3b2c11a9f049686d",
  measurementId: "G-82WSX2M2V3"
};

const app = initializeApp(firebaseConfig);

const auth =   getAuth(app);
const db = getFirestore(app);


export{ auth, db, doc, setDoc, getDoc, getDocs, collection}