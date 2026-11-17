import React, { useEffect, useState } from 'react'
import { MapPin, Navigation, User, Phone, Home, Building, Check, Loader2 } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'

export default function AddressForm({ onAddressUpdated }) {
  const toast = useToast()
  const [address, setAddress] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('fakestore_address')) || {
          name: '',
          number: '',
          address: '',
          city: '',
          zip: '',
        }
      )
    } catch (e) {
      return { name: '', number: '', address: '', city: '', zip: '' }
    }
  })

  const [detecting, setDetecting] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem('fakestore_address', JSON.stringify(address))
    if (onAddressUpdated) {
      onAddressUpdated(address)
    }
  }, [address, onAddressUpdated])

  function onChange(e) {
    setIsSaved(false)
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )
          const js = await res.json()
          const city =
            js.address?.city ||
            js.address?.town ||
            js.address?.village ||
            js.address?.county ||
            ''
          const road = js.address?.road || ''
          const postcode = js.address?.postcode || ''

          setAddress((prev) => ({
            ...prev,
            city: city || prev.city,
            address: road ? `${road}, ${city}` : prev.address,
            zip: postcode || prev.zip,
          }))

          toast.success(`Location detected: ${city || 'Coordinates saved'}!`)
        } catch (e) {
          console.error(e)
          toast.error('Could not resolve address details. Please fill manually.')
        } finally {
          setDetecting(false)
        }
      },
      (err) => {
        setDetecting(false)
        toast.warning('Location permission was denied or unavailable.')
      },
      { timeout: 10000 }
    )
  }

  function handleSave(e) {
    e.preventDefault()
    if (!address.name || !address.address) {
      toast.warning('Please enter at least your name and street address')
      return
    }
    localStorage.setItem('fakestore_address', JSON.stringify(address))
    setIsSaved(true)
    toast.success('Delivery address saved successfully!')
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Delivery Address</h3>
        </div>
        <button
          type="button"
          onClick={detectLocation}
          disabled={detecting}
          className="flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 disabled:opacity-50"
        >
          {detecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{detecting ? 'Locating...' : 'Auto-detect'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              name="name"
              value={address.name}
              onChange={onChange}
              placeholder="Full Name *"
              required
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
            />
          </div>

          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              name="number"
              value={address.number}
              onChange={onChange}
              placeholder="Phone Number"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
            />
          </div>
        </div>

        <div className="relative">
          <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            name="address"
            value={address.address}
            onChange={onChange}
            placeholder="Street Address, Apt / Suite *"
            required
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              name="city"
              value={address.city}
              onChange={onChange}
              placeholder="City / Area"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
            />
          </div>

          <input
            name="zip"
            value={address.zip || ''}
            onChange={onChange}
            placeholder="Postal / ZIP"
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Saved</span>
            </>
          ) : (
            <span>Save Address</span>
          )}
        </button>
      </form>
    </div>
  )
}
