import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Laptop, Gem, Shirt, Sparkles, ArrowRight } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SkeletonGrid } from '../components/SkeletonCard'
import ProductCard from '../components/ProductCard'

export default function Categories() {
  useDocumentTitle('Browse Categories')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState('all')

  useEffect(() => {
    setLoading(true)
    fetch('https://fakestoreapi.com/products')
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categoryCards = [
    {
      id: 'electronics',
      name: 'Electronics',
      tagline: 'Laptops, SSDs, 4K monitors & smart gadgets',
      icon: <Laptop className="w-6 h-6 text-indigo-500" />,
      color: 'from-indigo-500/10 to-indigo-900/10 border-indigo-500/20',
    },
    {
      id: 'jewelery',
      name: 'Jewelery',
      tagline: 'Gold, silver, diamond rings & fine accessories',
      icon: <Gem className="w-6 h-6 text-amber-500" />,
      color: 'from-amber-500/10 to-amber-900/10 border-amber-500/20',
    },
    {
      id: "men's clothing",
      name: "Men's Clothing",
      tagline: 'Casual outerwear, slim-fit tees & rugged jackets',
      icon: <Shirt className="w-6 h-6 text-sky-500" />,
      color: 'from-sky-500/10 to-sky-900/10 border-sky-500/20',
    },
    {
      id: "women's clothing",
      name: "Women's Clothing",
      tagline: 'Chic raincoats, dresses & contemporary fashion',
      icon: <Sparkles className="w-6 h-6 text-rose-500" />,
      color: 'from-rose-500/10 to-rose-900/10 border-rose-500/20',
    },
  ]

  const filtered =
    selectedCat === 'all'
      ? products
      : products.filter((p) => p.category.toLowerCase() === selectedCat.toLowerCase())

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore by Category
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Browse through our tailored collections designed for modern lifestyle.
        </p>
      </div>

      {/* Category Hero Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryCards.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCat(cat.id === selectedCat ? 'all' : cat.id)}
            className={`p-6 rounded-3xl border bg-gradient-to-br cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${
              cat.color
            } ${
              selectedCat === cat.id
                ? 'ring-2 ring-brand-500 shadow-md'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl w-fit shadow-sm mb-4">
              {cat.icon}
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              {cat.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {cat.tagline}
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 mt-4">
              <span>{selectedCat === cat.id ? 'Active Filter' : 'Filter Products'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filtered Products Display */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
            {selectedCat === 'all' ? 'All Products' : selectedCat} ({filtered.length})
          </h2>
          {selectedCat !== 'all' && (
            <button
              onClick={() => setSelectedCat('all')}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              Show all categories
            </button>
          )}
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
