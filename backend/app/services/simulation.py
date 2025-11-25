import numpy as np
import pandas as pd
from typing import Dict, List

def run_monte_carlo(prices: pd.DataFrame, weights: Dict[str, float], num_simulations: int = 1000, time_horizon: int = 252) -> Dict:
    """
    Runs Monte Carlo simulation for the portfolio.
    Returns aggregated stats.
    """
    # Calculate daily returns
    daily_returns = prices.pct_change().dropna()
    
    # Calculate mean returns and covariance matrix
    mean_returns = daily_returns.mean()
    cov_matrix = daily_returns.cov()
    
    # Align weights
    tickers = daily_returns.columns.tolist()
    weights_array = np.array([weights.get(t, 0)/100 for t in tickers])
    
    # Initial Portfolio Value
    initial_portfolio_value = 10000 # Arbitrary base for simulation
    
    # Simulation
    # Cholesky Decomposition for correlated random variables
    L = np.linalg.cholesky(cov_matrix)
    
    portfolio_sims = np.zeros((time_horizon, num_simulations))
    
    for m in range(num_simulations):
        # Generate random shocks
        Z = np.random.normal(size=(time_horizon, len(tickers)))
        daily_shocks = mean_returns.values + np.dot(Z, L.T)
        
        # Calculate portfolio daily returns for this path
        port_daily_ret = np.dot(daily_shocks, weights_array)
        
        # Accumulate returns
        cum_ret = np.cumprod(1 + port_daily_ret) * initial_portfolio_value
        portfolio_sims[:, m] = cum_ret
        
    # Analyze Results
    final_values = portfolio_sims[-1, :]
    total_returns = (final_values / initial_portfolio_value) - 1
    
    # Metrics
    median_return = np.median(total_returns)
    worst_case_percentile = np.percentile(total_returns, 5) # 5th percentile
    
    # CAGR (assuming 1 year horizon for simplicity of display)
    cagr = median_return 
    
    # Volatility of the simulation paths (std dev of final returns)
    sim_volatility = np.std(total_returns) 
    
    # Sharpe (assuming rf=0.02)
    sharpe = (cagr - 0.02) / sim_volatility if sim_volatility != 0 else 0
    
    
    # Sanitize values to prevent JSON serialization errors
    def sanitize(value, default=0.0):
        if np.isnan(value) or np.isinf(value):
            return default
        return value
    
    return {
        "cagr": sanitize(cagr, 0.0),
        "volatility": sanitize(sim_volatility, 0.0),
        "worst_case_percentile": sanitize(worst_case_percentile, 0.0),
        "median_return": sanitize(median_return, 0.0),
        "sharpe_ratio": sanitize(sharpe, 0.0)
    }
