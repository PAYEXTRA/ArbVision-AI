import React, { useState, useEffect } from 'react'

export function WalletConnect() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('0')

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        setAddress(accounts[0])
        setConnected(true)
        
        // Get balance
        const balanceWei = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        })
        const balanceEth = parseInt(balanceWei) / 1e18
        setBalance(balanceEth.toFixed(4))
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      alert('Please install MetaMask')
    }
  }

  const disconnectWallet = () => {
    setConnected(false)
    setAddress('')
    setBalance('0')
  }

  return (
    <div>
      {connected ? (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="font-bold text-accent">{balance} ETH</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Address</p>
            <p className="font-mono text-sm">{address.slice(0, 6)}...{address.slice(-4)}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-6 py-2 bg-accent hover:bg-blue-600 rounded font-bold transition"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
