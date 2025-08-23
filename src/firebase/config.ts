import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase project configuration
// Get these values from your Firebase console: https://console.firebase.google.com/
const firebaseConfig = {
    apiKey: "AIzaSyALia2dusCAGgvKX12qEMmJ6zhX4AnSBuw",
    authDomain: "blog-app-a76c2.firebaseapp.com",
    projectId: "blog-app-a76c2",
    storageBucket: "blog-app-a76c2.firebasestorage.app",
    messagingSenderId: "374053912983",
    appId: "1:374053912983:web:0c6a574141c52d14a844d2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }; 