import React from 'react'
import { SkeletonGrid } from './SkeletonCard'

export default function Loader({ text = 'Loading products...' }) {
  return (
    <div className="py-6 space-y-6">
      <SkeletonGrid count={8} />
    </div>
  )
}
