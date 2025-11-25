from fastapi import APIRouter, HTTPException
from ..models.schemas import PortfolioInput, AnalysisResult, DiversificationMetrics, RiskMetrics, SimulationResult, RebalancingSuggestion, Holding
from ..services import market_data, analytics, simulation, rebalancer
import pandas as pd

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_portfolio(input: PortfolioInput):
    tickers = [h.ticker for h in input.holdings]
    weights = {h.ticker: h.weight for h in input.holdings}
    
    # 1. Validate Weights
    if abs(sum(weights.values()) - 100) > 1:
        raise HTTPException(status_code=400, detail="Weights must sum to 100%")
        
    # 2. Fetch Data
    try:
        prices = market_data.fetch_historical_data(tickers)
        sector_map = market_data.get_sector_info(tickers)
        benchmark = market_data.get_benchmark_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")
        
    if prices.empty:
        raise HTTPException(status_code=400, detail="Could not fetch data for tickers")

    # 3. Calculate Metrics
    # Portfolio Returns
    port_returns = analytics.calculate_portfolio_returns(prices, weights)
    
    # Risk Metrics
    risk_metrics_dict = analytics.calculate_risk_metrics(port_returns, benchmark)
    risk_metrics = RiskMetrics(**risk_metrics_dict)
    
    # Diversification
    corr_matrix = prices.pct_change().corr()
    div_score, sector_alloc, hhi = analytics.calculate_diversification_score(weights, sector_map, corr_matrix)
    
    div_metrics = DiversificationMetrics(
        score=div_score,
        sector_allocation=sector_alloc,
        concentration_index=hhi
    )
    
    # Alerts
    sector_alerts, overexposure_warnings = analytics.check_alerts(weights, sector_alloc, corr_matrix)
    
    # 4. Simulation
    sim_results_dict = simulation.run_monte_carlo(prices, weights)
    sim_result = SimulationResult(**sim_results_dict)
    
    # 5. Rebalancing
    suggestions = rebalancer.suggest_allocations(input.holdings, risk_metrics_dict)
    
    # 6. Construct Response
    # Convert correlation matrix to dict for JSON
    # Replace NaN with 0 or similar for JSON safety
    corr_dict = corr_matrix.fillna(0).to_dict()
    
    return AnalysisResult(
        diversification=div_metrics,
        risk_profile=risk_metrics,
        sector_alerts=sector_alerts,
        overexposure_warnings=overexposure_warnings,
        volatility_forecast={"historical": risk_metrics.volatility, "simulated": sim_result.volatility},
        simulation=sim_result,
        rebalancing_suggestions=suggestions,
        correlation_matrix=corr_dict
    )
