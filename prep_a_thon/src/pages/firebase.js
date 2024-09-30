import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB3rFx3wCg50DpU4c_gRZrCKcxQGhLKvsU",
  authDomain: "interiit-f1cad.firebaseapp.com",
  projectId: "interiit-f1cad",
  storageBucket: "interiit-f1cad.appspot.com",
  messagingSenderId: "1007731609828",
  appId: "1:1007731609828:web:85b9588fbb854b29addcf1",
  databaseURL: "https://interiit-f1cad-default-rtdb.firebaseio.com/",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);