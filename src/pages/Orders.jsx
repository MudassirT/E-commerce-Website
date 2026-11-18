import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, Calendar, CheckCircle2, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Orders() {
  useDocumentTitle('My Orders')
  const { orders } = useCart()

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-5">
        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
          <Package className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            No Orders Yet
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            When you complete checkout, your order history, delivery status, and receipts will appear here.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Order History
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review past purchases, download invoices, and track live deliveries.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Order ID
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">#{order.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Date Placed
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {new Date(order.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Total Amount
                  </span>
                  <span className="font-extrabold text-brand-600 dark:text-brand-400">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full font-bold text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{order.status || 'Confirmed'}</span>
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="space-y-4 pb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <Link
                          to={`/product/${item.id}`}
                          className="text-xs font-semibold text-slate-900 dark:text-white hover:text-brand-600 line-clamp-1 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Qty: {item.qty} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white shrink-0">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Meta */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>
                    Estimated Delivery by{' '}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {order.estimatedDelivery}
                    </strong>
                  </span>
                </div>
                <div>Payment: {order.paymentMethod}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
