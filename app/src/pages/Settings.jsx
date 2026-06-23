import React, { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    contractAddress: '0x...',
    gasLimit: '1000000',
    maxSlippage: '0.5',
    minProfit: '0.1',
    autoTrade: true,
    notifications: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    localStorage.setItem('arbvision-settings', JSON.stringify(settings))
    alert('Settings saved!')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">⚙️ Settings</h1>

      <div className="glass-effect p-8 rounded-lg space-y-6">
        {/* Contract Address */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Contract Address</label>
          <input
            type="text"
            name="contractAddress"
            value={settings.contractAddress}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-secondary border border-accent/20 text-white font-mono text-sm"
            placeholder="0x..."
          />
        </div>

        {/* Gas Limit */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Gas Limit</label>
          <input
            type="number"
            name="gasLimit"
            value={settings.gasLimit}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-secondary border border-accent/20 text-white"
          />
        </div>

        {/* Max Slippage */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Max Slippage (%)</label>
          <input
            type="number"
            name="maxSlippage"
            value={settings.maxSlippage}
            onChange={handleChange}
            step="0.1"
            className="w-full px-4 py-2 rounded bg-secondary border border-accent/20 text-white"
          />
        </div>

        {/* Min Profit */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Minimum Profit ($)</label>
          <input
            type="number"
            name="minProfit"
            value={settings.minProfit}
            onChange={handleChange}
            step="0.1"
            className="w-full px-4 py-2 rounded bg-secondary border border-accent/20 text-white"
          />
        </div>

        {/* Auto Trade Toggle */}
        <div className="flex items-center justify-between p-4 bg-secondary rounded">
          <label className="text-gray-300">Auto Trade</label>
          <input
            type="checkbox"
            name="autoTrade"
            checked={settings.autoTrade}
            onChange={handleChange}
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-4 bg-secondary rounded">
          <label className="text-gray-300">Enable Notifications</label>
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-accent hover:bg-blue-600 rounded font-bold transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
