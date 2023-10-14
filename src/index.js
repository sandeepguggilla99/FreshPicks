// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { 
    getFirestore, collection, getDocs
} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkJbt9ewyYvPLb5LJDpDAFIaIvva9iaec",
  authDomain: "freshpicks-da3ef.firebaseapp.com",
  projectId: "freshpicks-da3ef",
  storageBucket: "freshpicks-da3ef.appspot.com",
  messagingSenderId: "610098249496",
  appId: "1:610098249496:web:0475aa3b2c11a9f049686d",
  measurementId: "G-82WSX2M2V3"
}

// init firebase app
initializeApp(firebaseConfig)

// init db
const db = getFirestore()

// collection ref

const ref = collection(db, 'Organizer')

// get collection Data
getDocs(ref)
.then ((snapshot) => {
    console.log(snapshot.docs)
})