import React from 'react'
import { WalletConnect } from './WalletConnect'

export default function Navbar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'arbitrage', label: 'Arbitrage', icon: '⚙️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-accent/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-accent">🤖 ArbVision</h1>
          <div className="hidden md:flex gap-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded transition ${currentPage === item.id
                  ? 'bg-accent text-white'
                  : 'text-gray-300 hover:text-accent'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <WalletConnect />
      </div>
    </nav>
  )
}
