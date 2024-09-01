import { boot } from "quasar/wrappers";

// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "firebase/app";
// import firebase from "firebase/app";
// import "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC45UIl0pWAJVs9CjpTsdQa6KvRHu4XKg",
  authDomain: "gastosquasar.firebaseapp.com",
  projectId: "gastosquasar",
  storageBucket: "gastosquasar.appspot.com",
  messagingSenderId: "689928783176",
  appId: "1:689928783176:web:702213affd2f6cc2a11f7d",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig);
const auth = getAuth();
// const db = firebase.firestore();
const db = getFirestore(firebaseApp);
export { auth, db };

export default boot(async (/* { app, router, ... } */) => {
  // something to do
});
