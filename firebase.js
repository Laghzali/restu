// Import the functions you need from the SDKs you need
import  * as firebase from "firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_duAwbCCZtErSqJddjMCF1wHe_bRHJok",
  authDomain: "restu-c181e.firebaseapp.com",
  projectId: "restu-c181e",
  storageBucket: "restu-c181e.appspot.com",
  messagingSenderId: "335483362873",
  appId: "1:335483362873:web:16bf6b09f495d7effcf7e8",
  measurementId: "G-VG5TRDZE56"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0 ) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app() 
}

const auth  = firebase.auth()
export {auth}