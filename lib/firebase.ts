import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcLtSnMtjRY-yzoX7gYyoqRaMb7nZ5vEg",
  authDomain: "real-estate-1c33d.firebaseapp.com",
  projectId: "real-estate-1c33d",
  storageBucket: "real-estate-1c33d.firebasestorage.app",
  messagingSenderId: "13262122226",
  appId: "1:13262122226:web:8f1d1336b34eca183f346b",
  measurementId: "G-62FBQVFCK2",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }

