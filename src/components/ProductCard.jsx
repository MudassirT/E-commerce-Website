import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingBag, Heart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useToast } from '../contexts/ToastContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const toast = useToast()

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`Added "${product.title.slice(0, 24)}..." to cart!`)
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
    if (inWishlist) {
      toast.info(`Removed from your wishlist`)
    } else {
      toast.success(`Saved to your wishlist!`)
    }
  }

  // Calculate a simulated original price (e.g. 20% higher)
  const originalPrice = (product.price * 1.25).toFixed(2)

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-card hover:shadow-card-hover p-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden"
    >
      {/* Top badges & actions */}
      <div className="flex items-center justify-between w-full mb-2 z-10">
        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {product.category}
        </span>
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`p-2 rounded-full transition-colors ${
            inWishlist
              ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/50'
              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image & Link */}
      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col items-center">
        <div className="w-full h-44 flex items-center justify-center p-2 mb-3 overflow-hidden rounded-xl bg-white dark:bg-slate-800/40">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Rating */}
        <div className="w-full flex items-center gap-1.5 mb-1.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {product.rating?.rate ?? '4.5'}
          </span>
          <span className="text-xs text-slate-400">
            ({product.rating?.count ?? '40'})
          </span>
        </div>

        {/* Title */}
        <h3 className="w-full text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {product.title}
        </h3>

        {/* Description snippet */}
        <p className="w-full text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {product.description}
        </p>
      </Link>

      {/* Price & Add to Cart Footer */}
      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            ${product.price.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 line-through">
            ${originalPrice}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </motion.div>
  )
}
