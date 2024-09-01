import { boot } from "quasar/wrappers";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useUserLoggedStore } from "src/stores/UsuariosStore";

const firebaseConfig = {
  apiKey: "AIzaSyDC45UIl0pWAJVs9CjpTsdQa6KvRHu4XKg",
  authDomain: "gastosquasar.firebaseapp.com",
  projectId: "gastosquasar",
  storageBucket: "gastosquasar.appspot.com",
  messagingSenderId: "689928783176",
  appId: "1:689928783176:web:702213affd2f6cc2a11f7d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();
const userStore = useUserLoggedStore();

const createUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      if (isUsuarioLogueado) {
        userStore.loginUser(user.email, user.uid);
      }
      return user.email;
    })
    .catch((error) => {
      return error.message;
    });
};

const loginUser = async (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      userStore.loginUser(user.email, user.uid);
    })
    .catch((error) => {
      return error.message;
    });
};
const isUsuarioLogueado = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      return true;
    } else {
      return false;
    }
  });
};
const isUsuarioLogueado2 = () => {
  return new Promise((resolve, reject) => {
    // Obtiene el usuario actual o null
    const user = auth.currentUser;
    // Si hay un usuario, resuelve con true
    if (user) {
      resolve(true);
    } else {
      // Si no hay un usuario, resuelve con false
      resolve(false);
    }
  });
};
export {
  db,
  auth,
  createUser,
  loginUser,
  isUsuarioLogueado,
  isUsuarioLogueado2,
};

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ router }) => {});
