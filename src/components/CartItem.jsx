import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link
          to={`/product/${item.id}`}
          className="w-20 h-20 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800"
        >
          <img
            src={item.image}
            alt={item.title}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {item.category}
          </span>
          <Link
            to={`/product/${item.id}`}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 line-clamp-1 transition-colors"
          >
            {item.title}
          </Link>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            ${item.price.toFixed(2)} each
          </div>
        </div>
      </div>

      {/* Quantity & Pricing Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        {/* Counter */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-0.5">
          <button
            onClick={() => onUpdate(item.id, item.qty - 1)}
            disabled={item.qty <= 1}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 min-w-[2rem] text-center">
            {item.qty}
          </span>
          <button
            onClick={() => onUpdate(item.id, item.qty + 1)}
            disabled={item.qty >= 99}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[5rem]">
          <span className="text-base font-bold text-slate-900 dark:text-white">
            ${(item.price * item.qty).toFixed(2)}
          </span>
        </div>

        {/* Delete */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
