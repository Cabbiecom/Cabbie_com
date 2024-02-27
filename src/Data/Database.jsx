// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDye39AYc4pb3lGfapdvnooiwAtgheuB4I",
    authDomain: "cabbiecormanfb.firebaseapp.com",
    databaseURL: "https://cabbiecormanfb-default-rtdb.firebaseio.com",
    projectId: "cabbiecormanfb",
    storageBucket: "cabbiecormanfb.appspot.com",
    messagingSenderId: "722409764986",
    appId: "1:722409764986:web:f051eca05162013836e3c3",
    measurementId: "G-VT0519T3Q5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth, analytics };