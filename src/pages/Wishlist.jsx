import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Wishlist() {
  useDocumentTitle('My Wishlist')
  const { wishlist, clearWishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const toast = useToast()

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => addToCart(item, 1))
    toast.success(`Moved all ${wishlist.length} items to your shopping cart!`)
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-5">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep track of favorite products by clicking the heart icon on any product card.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddAllToCart}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Move All to Cart</span>
          </button>
          <button
            onClick={clearWishlist}
            className="flex items-center gap-1.5 px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
