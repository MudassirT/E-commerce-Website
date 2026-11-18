import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react'
import CartItem from '../components/CartItem'
import AddressForm from '../components/AddressForm'
import CheckoutModal from '../components/CheckoutModal'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function CartPage() {
  useDocumentTitle('Shopping Cart')
  const {
    cart,
    updateQty,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shipping,
    estimatedTax,
    grandTotal,
    appliedCoupon,
    applyPromoCode,
    removePromoCode,
    freeShippingThreshold,
    freeShippingProgress,
    amountNeededForFreeShipping,
  } = useCart()

  const toast = useToast()
  const [promoInput, setPromoInput] = useState('')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    const res = applyPromoCode(promoInput)
    if (res.success) {
      toast.success(res.message)
      setPromoInput('')
    } else {
      toast.error(res.message)
    }
  }

  const handleClearCart = () => {
    clearCart()
    toast.info('Cart has been cleared.')
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 space-y-6">
        <div className="w-24 h-24 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Looks like you haven't added anything to your cart yet. Explore our curated collections
            and discover great deals!
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
        >
          <span>Discover Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title & Clear Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review your items and proceed to secure checkout.
          </p>
        </div>

        <button
          onClick={handleClearCart}
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Free Shipping Progress Meter */}
      <div className="p-4 bg-gradient-to-r from-brand-500/10 via-indigo-500/10 to-transparent border border-brand-500/20 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> You unlocked Free Express Shipping!
              </span>
            ) : (
              <span>Add ${amountNeededForFreeShipping.toFixed(2)} more for FREE shipping</span>
            )}
          </span>
          <span>{freeShippingProgress.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items vs Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={updateQty}
              onRemove={(id) => {
                removeFromCart(id)
                toast.info('Item removed from cart.')
              }}
            />
          ))}

          {/* Delivery Address Card under Cart */}
          <div className="pt-4">
            <AddressForm />
          </div>
        </div>

        {/* Right Col: Order Summary & Checkout */}
        <aside className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Promo Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                      Free
                    </span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Estimated Tax (5%)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Grand Total</span>
                <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo Code Form */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-slate-400 ml-1.5">({appliedCoupon.label})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removePromoCode()
                      toast.info('Promo code removed')
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (SAVE10)"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Guaranteed Safe & Secure Checkout</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  )
}
