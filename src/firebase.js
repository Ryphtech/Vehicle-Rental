import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCiT-xdOpr-ckI13BpaIUQX39KpGLamS8g",
    authDomain: "wheelslive.firebaseapp.com",
    projectId: "wheelslive",
    storageBucket: "wheelslive.firebasestorage.app",
    messagingSenderId: "560154633222",
    appId: "1:560154633222:web:36e8b8443f0773b5a0cf87",
    measurementId: "G-P4BQZHZ1ZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
