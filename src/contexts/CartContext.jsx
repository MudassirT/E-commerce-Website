import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

const PROMO_CODES = {
  SAVE10: { type: 'percent', value: 10, label: '10% Discount' },
  WELCOME20: { type: 'percent', value: 20, label: '20% Welcome Offer' },
  SUPER30: { type: 'percent', value: 30, label: '30% Super Deal' },
  FREESHIP: { type: 'shipping', value: 0, label: 'Free Express Shipping' },
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('fakestore_cart')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('shopzone_coupon')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      return null
    }
  })

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('shopzone_orders')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('fakestore_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('shopzone_coupon', JSON.stringify(appliedCoupon))
    } else {
      localStorage.removeItem('shopzone_coupon')
    }
  }, [appliedCoupon])

  useEffect(() => {
    localStorage.setItem('shopzone_orders', JSON.stringify(orders))
  }, [orders])

  function addToCart(product, qty = 1) {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id)
      if (idx === -1) return [...prev, { ...product, qty }]
      const copy = [...prev]
      copy[idx] = { ...copy[idx], qty: Math.min(99, copy[idx].qty + qty) }
      return copy
    })
  }

  function updateQty(id, qty) {
    if (qty <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, Math.max(1, qty)) } : i))
    )
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  function clearCart() {
    setCart([])
    setAppliedCoupon(null)
  }

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase()
    if (PROMO_CODES[clean]) {
      setAppliedCoupon({ code: clean, ...PROMO_CODES[clean] })
      return { success: true, message: `Coupon applied: ${PROMO_CODES[clean].label}!` }
    }
    return { success: false, message: 'Invalid promo code. Try SAVE10 or WELCOME20.' }
  }

  const removePromoCode = () => {
    setAppliedCoupon(null)
  }

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)
  }, [cart])

  const totalItemsCount = useMemo(() => {
    return cart.reduce((s, i) => s + (i.qty || 1), 0)
  }, [cart])

  const standardShipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99
  const shipping = appliedCoupon?.type === 'shipping' ? 0 : standardShipping

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0
    if (appliedCoupon.type === 'percent') {
      return (subtotal * appliedCoupon.value) / 100
    }
    return 0
  }, [subtotal, appliedCoupon])

  const estimatedTax = useMemo(() => {
    return (Math.max(0, subtotal - discount) * 0.05) // 5% tax
  }, [subtotal, discount])

  const grandTotal = useMemo(() => {
    if (subtotal === 0) return 0
    return Math.max(0, subtotal - discount + shipping + estimatedTax)
  }, [subtotal, discount, shipping, estimatedTax])

  const freeShippingThreshold = 50
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  function placeOrder(shippingAddress, paymentMethod = 'Card') {
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      discount,
      shipping,
      tax: estimatedTax,
      total: grandTotal,
      address: shippingAddress,
      paymentMethod,
      status: 'Confirmed',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    }

    setOrders((prev) => [newOrder, ...prev])
    clearCart()
    return newOrder
  }

  const value = {
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    total: subtotal,
    subtotal,
    discount,
    shipping,
    estimatedTax,
    grandTotal,
    totalItemsCount,
    appliedCoupon,
    applyPromoCode,
    removePromoCode,
    freeShippingThreshold,
    freeShippingProgress,
    amountNeededForFreeShipping,
    orders,
    placeOrder,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
