import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Share2,
  Check,
  Zap,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import CheckoutModal from '../components/CheckoutModal'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useToast } from '../contexts/ToastContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('overview')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Marcus Vance',
      rating: 5,
      date: '2 days ago',
      title: 'Exceeded my expectations!',
      comment: 'Super fast delivery and the build quality is top tier. Exactly as described.',
    },
    {
      id: 2,
      author: 'Elena Rostova',
      rating: 4,
      date: '1 week ago',
      title: 'Great value for the price',
      comment: 'Very happy with the purchase. Beautiful styling and premium packaging.',
    },
  ])
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 })

  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const toast = useToast()
  const { addProduct } = useRecentlyViewed()

  useDocumentTitle(product ? product.title : 'Product Details')

  useEffect(() => {
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Fetch this product
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data)
        addProduct(data)
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to load product details.')
      })
      .finally(() => setLoading(false))

    // Also fetch all products for related items
    fetch('https://fakestoreapi.com/products')
      .then((r) => r.json())
      .then(setAllProducts)
      .catch(console.error)
  }, [id, addProduct])

  const inWishlist = product ? isInWishlist(product.id) : false

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, qty)
    toast.success(`Added (${qty}) "${product.title.slice(0, 24)}..." to cart!`)
  }

  const handleBuyNow = () => {
    if (!product) return
    addToCart(product, qty)
    setIsCheckoutOpen(true)
  }

  const handleToggleWishlist = () => {
    if (!product) return
    toggleWishlist(product)
    if (inWishlist) {
      toast.info('Removed from your wishlist')
    } else {
      toast.success('Added to your wishlist!')
    }
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.info('Product link copied to clipboard!')
    }
  }

  const handleAddReview = (e) => {
    e.preventDefault()
    if (!newReview.name || !newReview.comment) {
      toast.warning('Please enter your name and comments')
      return
    }
    const created = {
      id: Date.now(),
      author: newReview.name,
      rating: Number(newReview.rating),
      date: 'Just now',
      title: 'Verified Purchase',
      comment: newReview.comment,
    }
    setReviews([created, ...reviews])
    setNewReview({ name: '', comment: '', rating: 5 })
    toast.success('Your review was submitted! Thank you.')
  }

  // Related products from same category
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return []
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [product, allProducts])

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-slate-500">The requested product could not be located.</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold">
          Return to Catalog
        </Link>
      </div>
    )
  }

  const originalPrice = (product.price * 1.25).toFixed(2)

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/?category=${encodeURIComponent(product.category)}`}
          className="capitalize hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: Product Image Showcase */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-card flex flex-col items-center justify-center relative group">
          {/* Wishlist & Share buttons */}
          <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`p-2.5 rounded-full transition-colors ${
                inWishlist
                  ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/60'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500'
              }`}
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="w-full h-80 sm:h-96 flex items-center justify-center p-4">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-80 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Quality badge */}
          <div className="w-full pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Guaranteed Genuine Product with Official Warranty</span>
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                In Stock
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating?.rate || 4)
                        ? 'fill-current'
                        : 'text-slate-200 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {product.rating?.rate ?? '4.5'}
              </span>
              <span className="text-xs text-slate-400">
                ({product.rating?.count ?? '120'} customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                ${product.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400 line-through">${originalPrice}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>Free Delivery</div>
              <div className="font-semibold text-slate-700 dark:text-slate-300">Estimated in 3 days</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Value Props Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-500" />
              <span>Free Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-500" />
              <span>30-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>Official Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Overview, Specs, Reviews) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-8 border-b border-slate-100 dark:border-slate-800 pb-4">
          {['overview', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-bold capitalize transition-colors relative pb-1 ${
                activeTab === tab
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {activeTab === 'overview' && (
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{product.description}</p>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">Key Highlights</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Designed for long-lasting durability and comfort.</li>
                <li>Crafted with high-grade materials meeting global industry standards.</li>
                <li>Fully backed by our 100% customer satisfaction guarantee.</li>
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-md text-xs space-y-2">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {product.category}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">SKU</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  SZ-PROD-{product.id}-2026
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Return Policy</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  30 Days Full Refund
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Warranty</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  1 Year Manufacturer
                </span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {rev.author}
                        </span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-semibold">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {rev.title}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add a Review Form */}
              <form
                onSubmit={handleAddReview}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Write a Customer Review
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="Your Name *"
                    required
                    className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                    <option value="3">⭐⭐⭐ 3 Stars - Average</option>
                    <option value="2">⭐⭐ 2 Stars - Fair</option>
                    <option value="1">⭐ 1 Star - Poor</option>
                  </select>
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share details of your experience with this item..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold"
                >
                  Post Review
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Similar Items You Might Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  )
}
