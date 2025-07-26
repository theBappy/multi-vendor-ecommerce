'use client'

import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Truck } from 'lucide-react'
import { useStore } from 'apps/user-ui/src/store'


const PaymentSuccessPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('sessionId')

  useEffect(() => {
    // Clear the cart
    useStore.setState({ cart: [] })

    // Trigger confetti animation
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    })
  }, [])

  const handleViewOrders = () => {
    router.push('/profile?active=My+Orders')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 px-4 text-center">
      <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
      <p className="text-gray-700 max-w-md mb-2">
        Your order has been confirmed and is being processed.
      </p>

      {/* Session ID display */}
      {sessionId && (
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Session ID:</span> {sessionId}
        </p>
      )}

      <button
        onClick={handleViewOrders}
        className="flex items-center gap-2 mt-4 bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 text-sm font-medium"
      >
        <Truck className="w-5 h-5" />
        Track Order
      </button>
    </div>
  )
}

export default PaymentSuccessPage
