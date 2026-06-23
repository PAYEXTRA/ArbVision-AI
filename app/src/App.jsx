import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Arbitrage from './pages/Arbitrage'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

const queryClient = new QueryClient()

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <QueryClientProvider client={queryClient}>
      <div className="gradient-bg min-h-screen">
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        <main className="container mx-auto px-4 py-8">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'arbitrage' && <Arbitrage />}
          {currentPage === 'analytics' && <Analytics />}
          {currentPage === 'settings' && <Settings />}
        </main>
      </div>
    </QueryClientProvider>
  )
}
