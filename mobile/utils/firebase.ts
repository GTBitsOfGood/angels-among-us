// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArVyAzA5r1pEgLC3VGCXov34HWt_-fnU4",
  authDomain: "angels-among-us-17126.firebaseapp.com",
  projectId: "angels-among-us-17126",
  storageBucket: "angels-among-us-17126.appspot.com",
  messagingSenderId: "698871630563",
  appId: "1:698871630563:web:a51ace26340ca032f0d3d6",
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth();

export { auth };
