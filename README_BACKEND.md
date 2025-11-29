# AI Portfolio Doctor

A full-stack application for analyzing stock portfolios, calculating risk metrics, and running Monte Carlo simulations.

## Features

- **Risk Analysis**: VaR, Beta, Volatility, Sharpe Ratio, Max Drawdown
- **Diversification Score**: Sector allocation and concentration analysis (HHI)
- **Correlation Heatmap**: Visual correlation matrix between holdings
- **Monte Carlo Simulation**: 1000+ runs to forecast future performance
- **Rebalancing Suggestions**: Balanced, Growth, and Low-Volatility portfolio options
- **Interactive Charts**: Sector allocation pie charts and simulation trajectories

## Tech Stack

- **Backend**: Python 3.9+, FastAPI, yfinance, pandas, numpy, scipy
- **Frontend**: Next.js 13 (React 18), TailwindCSS, Recharts
- **Testing**: pytest, httpx

## Prerequisites

- Python 3.9+
- Node.js 18+
- pip (Python package manager)
- npm (Node package manager)

## Quick Start

### Option 1: Run All (Recommended)

```bash
./run_all.sh
```

This script will:
- Clean up any existing processes on ports 8001 and 3000
- Start the backend on port 8001
- Start the frontend on port 3000
- Display URLs for both services

### Option 2: Manual Setup

#### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

The API will be available at:
- API: `http://localhost:8001`
- Interactive Docs: `http://localhost:8001/docs`

#### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:3000`

## Usage

1. Open the Frontend at `http://localhost:3000`
2. Enter your holdings in JSON format:
   ```json
   [
     {"ticker": "AAPL", "weight": 30},
     {"ticker": "MSFT", "weight": 25},
     {"ticker": "GOOGL", "weight": 20},
     {"ticker": "AMZN", "weight": 15},
     {"ticker": "TSLA", "weight": 10}
   ]
   ```
3. Click "Analyze Portfolio"
4. View the comprehensive health report with:
   - Diversification score and sector breakdown
   - Risk metrics (VaR, Beta, Volatility, Sharpe Ratio)
   - Correlation heatmap
   - Monte Carlo simulation results
   - Rebalancing suggestions

## JSON Input Format

The application accepts portfolio holdings in JSON format. You can input your data using either the **Form Input** tab (add holdings one by one) or the **JSON Input** tab (paste JSON directly).

### Required Format

An array of holdings, where each holding contains:
- **`ticker`**: Stock ticker symbol (string)
- **`weight`**: Percentage allocation (number, 0-100)

### Sample Input

```json
[
  { "ticker": "AAPL", "weight": 25 },
  { "ticker": "MSFT", "weight": 15 },
  { "ticker": "AMZN", "weight": 10 },
  { "ticker": "XOM", "weight": 20 },
  { "ticker": "JNJ", "weight": 30 }
]
```

### Requirements

1. **Weights must sum to 100%** (tolerance: ±1%)
2. Each weight must be **greater than 0** and **≤ 100**
3. Use valid US stock ticker symbols

### Additional Examples

**Tech-Heavy Portfolio:**
```json
[
  { "ticker": "GOOGL", "weight": 30 },
  { "ticker": "TSLA", "weight": 20 },
  { "ticker": "NVDA", "weight": 25 },
  { "ticker": "META", "weight": 15 },
  { "ticker": "NFLX", "weight": 10 }
]
```

**Balanced Portfolio:**
```json
[
  { "ticker": "SPY", "weight": 40 },
  { "ticker": "BND", "weight": 30 },
  { "ticker": "VNQ", "weight": 15 },
  { "ticker": "GLD", "weight": 10 },
  { "ticker": "VWO", "weight": 5 }
]
```

> **Tip**: Click the "Load Example" button in the UI to pre-fill the form with sample data.


## Testing

### Backend Tests

```bash
cd backend
PYTHONPATH=/Volumes/Sandisk01/AG-PortfolioDoctor/backend pytest tests/ -v
```

### Manual Testing

1. Start both servers (using `./run_all.sh` or manually)
2. Navigate to `http://localhost:3000`
3. Test the following flows:
   - Upload valid holdings JSON
   - Verify all dashboard components render (RiskCard, CorrelationHeatmap, SimulationChart)
   - Test error handling (invalid JSON, weights not summing to 100%)
   - Check responsive layout on different screen sizes

## Troubleshooting

### Port Already in Use

If you see "Address already in use" errors:

```bash
# Find and kill processes on port 8001 (backend)
lsof -ti:8001 | xargs kill -9

# Find and kill processes on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

Or simply use the `./run_all.sh` script which handles this automatically.

### Module Not Found Errors

If you encounter import errors in the backend:

```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

### Frontend Build Issues

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
AG-PortfolioDoctor/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic models
│   │   ├── routes/
│   │   │   └── analysis.py         # API endpoints
│   │   ├── services/
│   │   │   ├── analytics.py        # Risk & diversification calculations
│   │   │   ├── market_data.py      # yfinance data fetching
│   │   │   ├── rebalancer.py       # Portfolio rebalancing logic
│   │   │   └── simulation.py       # Monte Carlo simulations
│   │   └── main.py                 # FastAPI app entry point
│   ├── tests/
│   │   └── test_analysis.py        # Backend tests
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx                # Main page
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── HoldingsInput.tsx       # Input form
│   │   ├── RiskCard.tsx            # Risk metrics display
│   │   ├── CorrelationHeatmap.tsx  # Correlation table
│   │   ├── SimulationChart.tsx     # Monte Carlo chart
│   │   ├── ErrorBoundary.tsx       # Error handling
│   │   └── ui/
│   │       └── Card.tsx            # Reusable card component
│   ├── lib/
│   │   ├── api.ts                  # API client
│   │   └── types.ts                # TypeScript types
│   └── package.json
├── run_all.sh                      # Convenience script
└── README.md

```

## API Endpoints

### POST /api/analyze

Analyzes a portfolio and returns comprehensive metrics.

**Request Body:**
```json
{
  "holdings": [
    {"ticker": "AAPL", "weight": 50},
    {"ticker": "MSFT", "weight": 50}
  ]
}
```

**Response:** See `/docs` for full schema

## Development Notes

- The backend uses `yfinance` for market data (unofficial API, suitable for development/MVP)
- Monte Carlo simulations run 1000 iterations over a 1-year horizon
- Rebalancing suggestions use simplified heuristics (can be enhanced with optimization algorithms)
- CORS is enabled for all origins in development mode

## Future Enhancements

- [ ] PDF report generation
- [ ] Historical performance tracking
- [ ] More sophisticated rebalancing algorithms (Mean-Variance Optimization)
- [ ] Support for bonds, ETFs, and other asset classes
- [ ] User authentication and portfolio saving
- [ ] Real-time data updates

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
