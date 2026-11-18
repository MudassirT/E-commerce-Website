import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Zap,
  ShoppingBag,
  RotateCcw,
  Star,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'

export default function Home() {
  useDocumentTitle('Home')
  const [searchParams, setSearchParams] = useSearchParams()
  const { recentlyViewed } = useRecentlyViewed()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('featured') // 'featured', 'price-asc', 'price-desc', 'rating'
  const [maxPrice, setMaxPrice] = useState(1000)
  const [minRating, setMinRating] = useState(0)

  // Sync search query from URL parameter if Navbar search was submitted
  useEffect(() => {
    const query = searchParams.get('search')
    if (query !== null) {
      setSearchQuery(query)
    }
    const cat = searchParams.get('category')
    if (cat !== null) {
      setSelectedCategory(cat)
    }
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    fetch('https://fakestoreapi.com/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products')
        return res.json()
      })
      .then((data) => {
        setProducts(data)
        setError(null)
      })
      .catch((err) => {
        console.error(err)
        setError('Failed to fetch catalog. Please check your internet connection.')
      })
      .finally(() => setLoading(false))
  }, [])

  // Categories list
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)))
    return ['all', ...unique]
  }, [products])

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase()
        const matchesSearch =
          !searchQuery.trim() ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesPrice = p.price <= maxPrice
        const matchesRating = (p.rating?.rate || 0) >= minRating

        return matchesCategory && matchesSearch && matchesPrice && matchesRating
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'rating') return (b.rating?.rate || 0) - (a.rating?.rate || 0)
        return 0 // featured / default
      })
  }, [products, selectedCategory, searchQuery, sortBy, maxPrice, minRating])

  const clearAllFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSortBy('featured')
    setMaxPrice(1000)
    setMinRating(0)
    setSearchParams({})
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl p-8 sm:p-12 lg:p-16 border border-indigo-900/40">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Spring & Summer Collection 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-amber-300 via-indigo-200 to-white bg-clip-text text-transparent">
              Everyday Style
            </span>
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/80 leading-relaxed max-w-lg">
            Explore world-class electronics, luxury jewelry, and premium modern apparel crafted for contemporary life with free express shipping.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#products"
              className="px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 text-sm"
            >
              <span>Explore Products</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-xs text-indigo-200">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Use code <strong className="text-white">SAVE10</strong> for 10% off</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Promo Flash Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 dark:border-amber-500/30 flex items-center gap-4">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Flash Promo 20% Off</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Coupon code: WELCOME20</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-500/10 to-indigo-500/10 border border-brand-500/20 dark:border-brand-500/30 flex items-center gap-4">
          <div className="p-3 bg-brand-600 text-white rounded-xl shadow-md">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Top Rated Trends</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Handpicked items with 4.5+ ★</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Free Express Delivery</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">On all orders over $50</p>
          </div>
        </div>
      </section>

      {/* Filter and Products Section */}
      <section id="products" className="space-y-6">
        {/* Section Heading & Category Filter Chips */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curated Catalog
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setSearchParams((prev) => {
                    const p = new URLSearchParams(prev)
                    if (cat === 'all') p.delete('category')
                    else p.set('category', cat)
                    return p
                  })
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
          {/* Live Search inside Catalog */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Controls: Price, Rating, Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Min Rating Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="0">Rating: All</option>
                <option value="3">3.0+ Stars</option>
                <option value="4">4.0+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            {(selectedCategory !== 'all' || searchQuery || sortBy !== 'featured' || minRating > 0) && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid or Skeletons or Empty State */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : error ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
            <p className="text-rose-500 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              No matching products found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query, selecting another category, or resetting your filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed Products Section */}
      {recentlyViewed.length > 0 && (
        <section className="pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Recently Viewed</span>
              <span className="text-xs font-normal text-slate-400">({recentlyViewed.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyViewed.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="group p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="w-full h-28 flex items-center justify-center p-2 mb-2 bg-white dark:bg-slate-800/40 rounded-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-24 max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-600 transition-colors">
                  {item.title}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  ${item.price?.toFixed(2)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
