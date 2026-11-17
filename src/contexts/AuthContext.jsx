import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, googleProvider, githubProvider } from '../firebase'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('fakestore_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub = () => {}
    try {
      unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
          const small = {
            uid: u.uid,
            displayName: u.displayName || u.email?.split('@')[0] || 'Member',
            email: u.email,
            photoURL: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`,
          }
          setUser(small)
          localStorage.setItem('fakestore_user', JSON.stringify(small))
        } else {
          // Check if guest demo user is stored
          const saved = localStorage.getItem('fakestore_user')
          if (saved) {
            const parsed = JSON.parse(saved)
            if (parsed.isDemo) {
              setUser(parsed)
              setLoading(false)
              return
            }
          }
          setUser(null)
          localStorage.removeItem('fakestore_user')
        }
        setLoading(false)
      })
    } catch (err) {
      console.warn('Firebase auth listener not initialized:', err)
      setLoading(false)
    }
    return unsub
  }, [])

  async function signInWithGoogle() {
    try {
      return await signInWithPopup(auth, googleProvider)
    } catch (error) {
      // If Firebase isn't configured, offer fallback demo session
      if (error.code === 'auth/configuration-not-found' || error.message.includes('API key') || error.code === 'auth/invalid-api-key') {
        const demoUser = {
          uid: 'demo-google-user',
          displayName: 'Alex Rivers',
          email: 'alex.rivers@example.com',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          isDemo: true,
        }
        setUser(demoUser)
        localStorage.setItem('fakestore_user', JSON.stringify(demoUser))
        return { user: demoUser }
      }
      throw error
    }
  }

  async function signInWithGithub() {
    try {
      return await signInWithPopup(auth, githubProvider)
    } catch (error) {
      if (error.code === 'auth/configuration-not-found' || error.message.includes('API key') || error.code === 'auth/invalid-api-key') {
        const demoUser = {
          uid: 'demo-github-user',
          displayName: 'Dev Hunter',
          email: 'dev@github.com',
          photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          isDemo: true,
        }
        setUser(demoUser)
        localStorage.setItem('fakestore_user', JSON.stringify(demoUser))
        return { user: demoUser }
      }
      throw error
    }
  }

  async function signInEmail(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (error.code === 'auth/invalid-api-key' || error.code === 'auth/configuration-not-found' || error.message.includes('API key')) {
        // Fallback demo user
        const demoUser = {
          uid: 'demo-email-user',
          displayName: email.split('@')[0],
          email: email,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          isDemo: true,
        }
        setUser(demoUser)
        localStorage.setItem('fakestore_user', JSON.stringify(demoUser))
        return { user: demoUser }
      }
      throw error
    }
  }

  async function signUpEmail(email, password, name) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (cred.user && name) {
        await updateProfile(cred.user, { displayName: name })
      }
      return cred
    } catch (error) {
      if (error.code === 'auth/invalid-api-key' || error.code === 'auth/configuration-not-found' || error.message.includes('API key')) {
        const demoUser = {
          uid: 'demo-new-user',
          displayName: name || email.split('@')[0],
          email: email,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          isDemo: true,
        }
        setUser(demoUser)
        localStorage.setItem('fakestore_user', JSON.stringify(demoUser))
        return { user: demoUser }
      }
      throw error
    }
  }

  function signInDemo() {
    const demoUser = {
      uid: 'demo-vip-shopper',
      displayName: 'Sophia Martinez',
      email: 'sophia.vip@shopzone.com',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      isDemo: true,
    }
    setUser(demoUser)
    localStorage.setItem('fakestore_user', JSON.stringify(demoUser))
    return demoUser
  }

  async function signOut() {
    try {
      await fbSignOut(auth)
    } catch (e) {}
    setUser(null)
    localStorage.removeItem('fakestore_user')
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signInEmail,
    signUpEmail,
    signInDemo,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
