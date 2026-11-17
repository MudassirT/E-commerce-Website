import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, grandTotal, shipping, discount, placeOrder } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1: Address & Details, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: 'Jane Doe',
    expiry: '12/28',
    cvv: '987',
  })

  // Address retrieval from localStorage
  const savedAddress = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem('fakestore_address')) || {
          name: 'Jane Doe',
          address: '742 Evergreen Terrace',
          city: 'Springfield',
          number: '+1 (555) 019-2834',
        }
      )
    } catch (e) {
      return {
        name: 'Jane Doe',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        number: '+1 (555) 019-2834',
      }
    }
  })()

  if (!isOpen) return null

  const handleProcessPayment = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const order = placeOrder(savedAddress, paymentMethod === 'card' ? 'Visa •••• 4242' : 'Cash on Delivery')
      setCreatedOrder(order)
      setStep(3)

      // Trigger Confetti explosion
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch (e) {}

      toast.success('🎉 Order successfully confirmed!')
    }, 1400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                {step === 3 ? 'Order Completed' : 'Express Checkout'}
              </h3>
              <p className="text-xs text-slate-400">
                {step === 1 && 'Step 1 of 2: Shipping Confirmation'}
                {step === 2 && 'Step 2 of 2: Payment Simulation'}
                {step === 3 && 'Order Placed & Confirmed'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Shipping preview */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    <Truck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span>Delivery Address</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {savedAddress.name || 'Recipient Name'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {savedAddress.address || 'Street Address'}, {savedAddress.city || 'City'}
                  </div>
                  {savedAddress.number && (
                    <div className="text-xs text-slate-500 mt-0.5">{savedAddress.number}</div>
                  )}
                </div>

                {/* Items preview summary */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Order Items ({cart.length})
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img
                            src={item.image}
                            alt=""
                            className="w-7 h-7 object-contain bg-white rounded p-0.5"
                          />
                          <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                            {item.title}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white shrink-0 ml-2">
                          {item.qty} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 text-sm">
                    Total Due
                  </span>
                  <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Method selector */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    <div>
                      <div className="text-xs">Credit / Debit Card</div>
                      <div className="text-[10px] text-slate-400">Visa, MC, Amex</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    <div>
                      <div className="text-xs">Cash on Delivery</div>
                      <div className="text-[10px] text-slate-400">Pay upon arrival</div>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-mono tracking-widest text-indigo-300">
                        SHOPZONE PLATINUM
                      </span>
                      <CreditCard className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div className="font-mono text-base tracking-widest mb-4">
                      {cardData.number}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] text-indigo-300 uppercase">Cardholder</div>
                        <div className="text-xs font-semibold">{cardData.name}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-indigo-300 uppercase">Expires</div>
                        <div className="text-xs font-semibold">{cardData.expiry}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 justify-center">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-bit encrypted simulated test checkout</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-xs transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProcessPayment}
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <span>Processing Payment...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Pay ${grandTotal.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && createdOrder && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Thank You for Your Order!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your order <span className="font-bold text-slate-800 dark:text-slate-200">#{createdOrder.id}</span> has been confirmed.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-left text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Delivery:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {createdOrder.estimatedDelivery}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Paid:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ${createdOrder.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {createdOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClose()
                      navigate('/orders')
                    }}
                    className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-xs transition-colors"
                  >
                    View Order Details
                  </button>
                  <button
                    onClick={() => {
                      onClose()
                      navigate('/')
                    }}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
