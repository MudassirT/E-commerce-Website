import React from 'react'

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full animate-pulse">
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4 relative overflow-hidden">
        <div className="absolute inset-0 shimmer-effect" />
      </div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 mb-2" />
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5 mb-3" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-full mb-1" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3 mb-4" />
      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-20" />
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default SkeletonCard
