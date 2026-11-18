import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Home, Compass } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('404 Page Not Found')

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="relative">
        <span className="text-8xl sm:text-9xl font-black text-slate-200 dark:text-slate-800 tracking-tighter select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-xl shadow-brand-500/30">
            <ShoppingBag className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Looks Like You're Lost
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          The page you requested could not be found. It might have been moved, renamed, or temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/categories"
          className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Browse Categories</span>
        </Link>
      </div>
    </div>
  )
}
