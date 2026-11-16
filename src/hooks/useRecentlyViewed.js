import { useState, useEffect, useCallback } from 'react'

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem('shopzone_recently_viewed')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('shopzone_recently_viewed', JSON.stringify(recentlyViewed))
    } catch (e) {}
  }, [recentlyViewed])

  const addProduct = useCallback((product) => {
    if (!product || !product.id) return
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      return [
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating,
        },
        ...filtered,
      ].slice(0, 8)
    })
  }, [])

  return { recentlyViewed, addProduct }
}
