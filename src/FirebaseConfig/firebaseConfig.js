
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import 'firebase/compat/auth';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: 'AIzaSyC1Fh22J9KAUbExfSEfYD5QvXgktO0cAUw',
    authDomain: 'https://fir-test-558de-default-rtdb.firebaseio.com',
    databaseURL: 'https://fir-test-558de-default-rtdb.firebaseio.com/',
    projectId: 'fir-test-558de',
    storageBucket: "fir-test-558de.appspot.com"
    // Add other Firebase config properties here
  };
  
  // Initialize Firebase
  const app =firebase.initializeApp(firebaseConfig);
  export const db = getDatabase(app);
  export const storage = getStorage(app);
  export const auth = getAuth(app);