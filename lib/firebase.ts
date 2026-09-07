import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1h_Ws8WwIM-uV3Loycj2MXUQSu4DHxSE",
  authDomain: "pixelplay-5847b.firebaseapp.com",
  projectId: "pixelplay-5847b",
  storageBucket: "pixelplay-5847b.firebasestorage.app",
  messagingSenderId: "528627838686",
  appId: "1:528627838686:web:3bb6bbfdba1311a3349c4f",
  measurementId: "G-KM2S0V6PS9",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);

export default app;
