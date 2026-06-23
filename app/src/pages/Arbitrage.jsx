import React, { useState } from 'react'
import { ArbitrageForm } from '../components/ArbitrageForm'
import { ArbitragePreview } from '../components/ArbitragePreview'

export default function Arbitrage() {
  const [formData, setFormData] = useState({
    baseToken: '',
    intermediateToken: '',
    amount: '',
    routerA: '',
    routerB: '',
  })

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleQuote = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPreview({
        profitable: true,
        estimatedProfit: '$24.50',
        gasCost: '0.025 ETH',
        slippage: '0.5%',
        finalAmount: '10.524 ETH',
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ArbitrageForm formData={formData} setFormData={setFormData} onQuote={handleQuote} loading={loading} />
      {preview && <ArbitragePreview preview={preview} />}
    </div>
  )
}
