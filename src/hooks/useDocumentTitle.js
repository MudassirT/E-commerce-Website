import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title ? `${title} | ShopZone` : 'ShopZone | Premium E-Commerce Experience'
    return () => {
      document.title = prevTitle
    }
  }, [title])
}
