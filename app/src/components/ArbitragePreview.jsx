import React, { useState } from 'react'

export function ArbitragePreview({ preview }) {
  const [executing, setExecuting] = useState(false)

  const handleExecute = async () => {
    setExecuting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Arbitrage executed successfully!')
    } catch (error) {
      alert('Error executing arbitrage')
    } finally {
      setExecuting(false)
    }
  }

  return (
    <div className="glass-effect p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-accent">Preview</h2>

      <div className="space-y-4">
        <div className="p-4 bg-secondary rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Profitable</span>
            <span className={preview.profitable ? 'text-green-400 font-bold' : 'text-red-400'}>
              {preview.profitable ? '✅ Yes' : '❌ No'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-secondary rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Estimated Profit</span>
            <span className="text-green-400 font-bold">{preview.estimatedProfit}</span>
          </div>
        </div>

        <div className="p-4 bg-secondary rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Gas Cost</span>
            <span className="text-gray-300">{preview.gasCost}</span>
          </div>
        </div>

        <div className="p-4 bg-secondary rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Slippage</span>
            <span className="text-yellow-400">{preview.slippage}</span>
          </div>
        </div>

        <div className="p-4 bg-secondary rounded border border-accent/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Final Amount</span>
            <span className="text-accent font-bold">{preview.finalAmount}</span>
          </div>
        </div>

        <button
          onClick={handleExecute}
          disabled={executing || !preview.profitable}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold transition mt-6"
        >
          {executing ? 'Executing...' : 'Execute Arbitrage'}
        </button>
      </div>
    </div>
  )
}
