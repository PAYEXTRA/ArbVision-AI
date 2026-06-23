import React from 'react'

export function ArbitrageForm({ formData, setFormData, onQuote, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const tokens = [
    { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e8e4F27ead9083C756Cc2', icon: 'Ξ' },
    { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', icon: '💵' },
    { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', icon: '🪙' },
  ]

  const routers = [
    { name: 'Uniswap V2', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' },
    { name: 'SushiSwap', address: '0xd9e1cE17f2641f24aE31b8eC6c6EB8da912F8a7' },
  ]

  return (
    <div className="glass-effect p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-accent">Execute Arbitrage</h2>

      <div className="space-y-4">
        {/* Base Token */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Base Token</label>
          <select
            name="baseToken"
            value={formData.baseToken}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-secondary border border-accent/20 text-white"
          >
            <option value="">Select token...</option>
            {tokens.map(t => (
              <option key={t.symbol} value={t.address}>
                {t.icon} {t.symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount..."
            className="w-full px-4 py-2 rounded bg-secondary border border-accent/20 text-white"
          />
        </div>

        {/* Intermediate Token */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Intermediate Token</label>
          <select
            name="intermediateToken"
            value={formData.intermediateToken}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-secondary border border-accent/20 text-white"
          >
            <option value="">Select token...</option>
            {tokens.map(t => (
              <option key={t.symbol} value={t.address}>
                {t.icon} {t.symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Router A */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">DEX Router A (Buy)</label>
          <select
            name="routerA"
            value={formData.routerA}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-secondary border border-accent/20 text-white"
          >
            <option value="">Select router...</option>
            {routers.map(r => (
              <option key={r.name} value={r.address}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Router B */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">DEX Router B (Sell)</label>
          <select
            name="routerB"
            value={formData.routerB}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-secondary border border-accent/20 text-white"
          >
            <option value="">Select router...</option>
            {routers.map(r => (
              <option key={r.name} value={r.address}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Quote Button */}
        <button
          onClick={onQuote}
          disabled={loading || !formData.baseToken || !formData.amount}
          className="w-full py-3 bg-accent hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold transition"
        >
          {loading ? 'Getting Quote...' : 'Get Quote'}
        </button>
      </div>
    </div>
  )
}
