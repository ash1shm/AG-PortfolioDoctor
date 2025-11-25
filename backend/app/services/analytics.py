import numpy as np
import pandas as pd
from scipy.stats import norm
from typing import List, Dict, Tuple

def calculate_portfolio_returns(prices: pd.DataFrame, weights: Dict[str, float]) -> pd.Series:
    """
    Calculates the daily returns of the portfolio.
    """
    daily_returns = prices.pct_change().dropna()
    
    # Align weights with columns in daily_returns
    ordered_weights = [weights.get(ticker, 0) for ticker in daily_returns.columns]
    
    # Calculate portfolio return
    portfolio_returns = daily_returns.dot(ordered_weights)
    return portfolio_returns

def calculate_risk_metrics(portfolio_returns: pd.Series, benchmark_returns: pd.Series) -> Dict[str, float]:
    """
    Calculates Beta, Volatility, Sharpe Ratio, VaR, Max Drawdown.
    """
    # Annualized Volatility
    volatility = portfolio_returns.std() * np.sqrt(252)
    
    # Sharpe Ratio (assuming risk-free rate = 0 for simplicity, or 2%)
    rf = 0.02
    mean_return = portfolio_returns.mean() * 252
    sharpe_ratio = (mean_return - rf) / volatility if volatility != 0 else 0
    
    # Beta
    # Align dates
    common_dates = portfolio_returns.index.intersection(benchmark_returns.index)
    port_ret = portfolio_returns.loc[common_dates]
    bench_ret = benchmark_returns.loc[common_dates]
    
    covariance = np.cov(port_ret, bench_ret)[0, 1]
    variance = np.var(bench_ret)
    beta = covariance / variance if variance != 0 else 1.0
    
    # Value at Risk (95%)
    # Historical VaR
    var_95 = np.percentile(portfolio_returns, 5)
    
    # Max Drawdown
    cumulative_returns = (1 + portfolio_returns).cumprod()
    peak = cumulative_returns.expanding(min_periods=1).max()
    drawdown = (cumulative_returns / peak) - 1
    max_drawdown = drawdown.min()
    
    
    # Sanitize values to prevent JSON serialization errors
    def sanitize(value, default=0.0):
        if np.isnan(value) or np.isinf(value):
            return default
        return value
    
    return {
        "beta": sanitize(beta, 1.0),
        "volatility": sanitize(volatility, 0.0),
        "sharpe_ratio": sanitize(sharpe_ratio, 0.0),
        "var_95": sanitize(var_95, 0.0),
        "max_drawdown": sanitize(max_drawdown, 0.0)
    }

def calculate_diversification_score(weights: Dict[str, float], sector_map: Dict[str, str], correlation_matrix: pd.DataFrame) -> Tuple[float, Dict[str, float], float]:
    """
    Calculates a diversification score (0-100), sector allocation, and HHI.
    """
    # 1. Sector Allocation
    sector_allocation = {}
    total_weight = sum(weights.values())
    
    for ticker, weight in weights.items():
        sector = sector_map.get(ticker, 'Unknown')
        sector_allocation[sector] = sector_allocation.get(sector, 0) + weight
        
    # Normalize weights if they don't sum to 1 (or 100)
    # Assuming input weights are 0-100, let's normalize to 0-1 for calc
    norm_weights = {k: v/100 for k, v in weights.items()}
    
    # 2. Herfindahl-Hirschman Index (HHI) for Concentration
    # Sum of squared weights. Lower is better.
    hhi = sum([w**2 for w in norm_weights.values()])
    
    # 3. Correlation Impact
    # Average correlation weighted by position size could be a factor
    # For simplicity, let's use a heuristic based on HHI and Sector spread
    
    # Score Calculation (Heuristic)
    # Base score starts at 100
    # Penalize for high HHI (Concentration)
    # Penalize for high sector concentration
    
    score = 100
    
    # HHI Penalty: HHI of 1.0 (single stock) -> -50
    # HHI of 0.1 (10 stocks equal weight) -> -5
    score -= hhi * 50
    
    # Sector Penalty
    # If any sector > 40%, penalize
    max_sector = max(sector_allocation.values()) / 100 # normalize to 0-1
    if max_sector > 0.4:
        score -= (max_sector - 0.4) * 100 # e.g. 0.5 -> -10 pts
        
    # Correlation Penalty
    # If avg correlation is high, reduce score
    avg_corr = correlation_matrix.mean().mean()
    if avg_corr > 0.7:
        score -= 20
        
    return max(0, min(100, score)), sector_allocation, hhi

def check_alerts(weights: Dict[str, float], sector_allocation: Dict[str, float], correlation_matrix: pd.DataFrame) -> Tuple[List[str], List[str]]:
    """
    Generates sector alerts and overexposure warnings.
    """
    sector_alerts = []
    overexposure_warnings = []
    
    # Sector Alerts
    for sector, weight in sector_allocation.items():
        if weight > 40:
            sector_alerts.append(f"High exposure to {sector}: {weight:.1f}%")
            
    # Overexposure Warnings
    # Single stock > 12%
    for ticker, weight in weights.items():
        if weight > 12:
            overexposure_warnings.append(f"Single stock overexposure: {ticker} ({weight:.1f}%)")
            
    # High Correlation Clusters
    # Simple check: pairs with > 0.85 correlation
    # To avoid duplicates, check upper triangle
    corr_pairs = []
    for i in range(len(correlation_matrix.columns)):
        for j in range(i+1, len(correlation_matrix.columns)):
            if correlation_matrix.iloc[i, j] > 0.85:
                t1 = correlation_matrix.columns[i]
                t2 = correlation_matrix.columns[j]
                corr_pairs.append(f"{t1}-{t2}")
                
    if corr_pairs:
        overexposure_warnings.append(f"Highly correlated pairs: {', '.join(corr_pairs[:3])}...")
        
    return sector_alerts, overexposure_warnings
