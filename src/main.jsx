import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { AuthProvider } from './contexts/AuthContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { CartProvider } from './contexts/CartContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
)
