import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'

// Provide your Firebase config in environment variables or replace with values.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '<REPLACE_ME>',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '<REPLACE_ME>',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '<REPLACE_ME>',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '<REPLACE_ME>',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '<REPLACE_ME>',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '<REPLACE_ME>'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

export default app
