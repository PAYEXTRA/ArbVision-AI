import React from 'react'

export default function Analytics() {
  const metrics = [
    { label: '24h Volume', value: '$1.2M', change: '+12.5%' },
    { label: 'Total Profit', value: '$45.8K', change: '+8.3%' },
    { label: 'Win Rate', value: '92.4%', change: '+2.1%' },
    { label: 'Sharpe Ratio', value: '1.85', change: '+0.3' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📈 Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="glass-effect p-6 rounded-lg">
            <p className="text-gray-400 text-sm">{metric.label}</p>
            <p className="text-2xl font-bold text-accent mt-2">{metric.value}</p>
            <p className="text-green-400 text-sm mt-2">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="glass-effect p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Performance by Strategy</h2>
        <div className="space-y-3">
          {[
            { name: 'WETH/DAI', trades: 234, profit: '$1,245.50', roi: '12.5%' },
            { name: 'USDC/DAI', trades: 189, profit: '$892.30', roi: '9.8%' },
            { name: 'WETH/USDC', trades: 156, profit: '$745.20', roi: '8.2%' },
          ].map((strategy, idx) => (
            <div key={idx} className="p-4 bg-secondary rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{strategy.name}</p>
                  <p className="text-gray-400 text-sm">{strategy.trades} trades</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{strategy.profit}</p>
                  <p className="text-gray-400 text-sm">{strategy.roi} ROI</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
