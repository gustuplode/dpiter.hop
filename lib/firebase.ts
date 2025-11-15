import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyBG5BTpoSOgmkwWh3zxpRHvYtYyCJsesf8",
  authDomain: "dpiter-a8e58.firebaseapp.com",
  projectId: "dpiter-a8e58",
  storageBucket: "dpiter-a8e58.firebasestorage.app",
  messagingSenderId: "533443946188",
  appId: "1:533443946188:web:f6bf36693fa0d27a280469",
  measurementId: "G-KT2RQ4PZYJ"
}

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Enable auto-select for Google accounts
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Initialize analytics only on client side
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export { app, auth, googleProvider, analytics }
