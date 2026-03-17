import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function testFirebase() {
  try {
    const testRef = push(ref(db, 'test_messages'));
    await set(testRef, { test: 'hello world' });
    console.log("Firebase write success!");
    process.exit(0);
  } catch (error) {
    console.error("Firebase write error:", error);
    process.exit(1);
  }
}

testFirebase();
