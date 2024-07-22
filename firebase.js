// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW9zTcA3_MxOk6F5pRpUrcPS13NDPXYkQ",
  authDomain: "youssi-chat-app.firebaseapp.com",
  databaseURL: "https://youssi-chat-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "youssi-chat-app",
  storageBucket: "youssi-chat-app.appspot.com",
  messagingSenderId: "312532462153",
  appId: "1:312532462153:web:fd0d1087f8e52b6023ad98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const storage = getStorage(app);

export default app;