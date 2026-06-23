import React, { useEffect, useState } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockData = [
  { time: '12:00', profit: 100, volume: 500 },
  { time: '12:15', profit: 250, volume: 750 },
  { time: '12:30', profit: 180, volume: 600 },
  { time: '12:45', profit: 320, volume: 900 },
  { time: '13:00', profit: 400, volume: 1200 },
]

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProfits: '$12,450.50',
    successRate: '94.2%',
    totalTrades: 847,
    avgProfit: '$14.71',
  })

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Profits', value: stats.totalProfits, icon: '💰' },
          { label: 'Success Rate', value: stats.successRate, icon: '✅' },
          { label: 'Total Trades', value: stats.totalTrades, icon: '📊' },
          { label: 'Avg Profit', value: stats.avgProfit, icon: '📈' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-effect p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-accent mt-2">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Chart */}
        <div className="glass-effect p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Profit Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Area type="monotone" dataKey="profit" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Chart */}
        <div className="glass-effect p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Trading Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="glass-effect p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Recent Trades</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-left py-3 px-4">Trade ID</th>
                <th className="text-left py-3 px-4">Token Pair</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Profit</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <tr key={idx} className="border-b border-accent/10 hover:bg-accent/5">
                  <td className="py-3 px-4 font-mono">#TRD{String(idx + 1).padStart(5, '0')}</td>
                  <td className="py-3 px-4">WETH/DAI</td>
                  <td className="py-3 px-4">10.5 ETH</td>
                  <td className="py-3 px-4 text-green-400 font-bold">+$24.50</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
