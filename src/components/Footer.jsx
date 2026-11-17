import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  ArrowUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Send,
} from 'lucide-react'
import { useToast } from '../contexts/ToastContext'

export default function Footer() {
  const [email, setEmail] = useState('')
  const toast = useToast()

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.warning('Please enter a valid email address')
      return
    }
    toast.success('Thank you for subscribing! Check your inbox for 10% off.')
    setEmail('')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors">
      {/* Top Value Badges Bar */}
      <div className="border-b border-slate-800 py-8 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400">On all orders over $50</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">30-Day Hassle-Free</h4>
                <p className="text-xs text-slate-400">Full money-back guarantee</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">256-Bit SSL Checkout</h4>
                <p className="text-xs text-slate-400">100% Secure payments</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-400">Always here to help you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Shop<span className="text-brand-400">Zone</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              ShopZone is your premier destination for handpicked fashion, cutting-edge electronics, and timeless accessories designed to elevate your lifestyle.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Accepted Payment Methods
              </span>
              <div className="flex items-center gap-2 text-xs">
                {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-md text-[11px] font-medium text-slate-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Collections</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Jewelery & Gems
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Men's Apparel
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Women's Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => toast.info('Support: support@shopzone.dev')}>
                  Help Center
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => toast.info('Standard delivery: 2-4 business days.')}>
                  Shipping Information
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stay in the Loop</h4>
            <p className="text-xs text-slate-400">
              Subscribe for exclusive flash sales, new drops, and 10% off your first order.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 p-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Back to Top Bar */}
      <div className="border-t border-slate-800 py-6 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ShopZone Inc. All rights reserved. Built with React & Vite.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer" onClick={() => toast.info('Privacy policy: We respect your privacy.')}>
              Privacy Policy
            </span>
            <span className="hover:text-slate-400 cursor-pointer" onClick={() => toast.info('Terms: Standard consumer retail terms apply.')}>
              Terms of Service
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
