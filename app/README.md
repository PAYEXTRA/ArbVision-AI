# ArbVision Web Application

Web UI and API for the FlashLoanArbitrage smart contract.

## 🚀 Getting Started

### Installation

```bash
cd app
npm install
```

### Configuration

```bash
cp .env.example .env
# Edit .env with your RPC URL and contract address
```

### Development

```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start Express API
npm run server
```

App will be available at `http://localhost:5173`

## 📦 Features

- **Dashboard**: Real-time profit tracking and analytics
- **Arbitrage**: Execute trades with live profitability preview
- **Analytics**: Detailed performance metrics
- **Settings**: Configure trade parameters
- **Wallet Connect**: MetaMask integration

## 📁 Project Structure

```
app/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── App.jsx        # Main app
│   └── index.css      # Tailwind styles
├── server.js          # Express API
├── vite.config.js     # Vite config
├── tailwind.config.js # Tailwind config
└── package.json       # Dependencies
```

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `POST /api/quote` - Get arbitrage quote
- `POST /api/execute` - Execute arbitrage
- `GET /api/stats` - Get trading statistics

## 🔗 Smart Contract Integration

Connects to deployed FlashLoanArbitrage contract via:
- Web3.js / Ethers.js
- MetaMask wallet
- Mainnet RPC provider

## 🎨 Design

- Tailwind CSS for styling
- Recharts for data visualization
- Glass morphism effects
- Dark theme optimized for crypto

## 📝 License

MIT
