from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class Holding(BaseModel):
    ticker: str
    weight: float = Field(..., gt=0, le=100, description="Percentage weight of the holding (0-100)")

class PortfolioInput(BaseModel):
    holdings: List[Holding]

class RiskMetrics(BaseModel):
    beta: float
    volatility: float
    sharpe_ratio: float
    var_95: float
    max_drawdown: float

class DiversificationMetrics(BaseModel):
    score: float
    sector_allocation: Dict[str, float]
    concentration_index: float # HHI

class SimulationResult(BaseModel):
    cagr: float
    volatility: float
    worst_case_percentile: float
    median_return: float
    sharpe_ratio: float

class RebalancingSuggestion(BaseModel):
    type: str # Balanced, Growth, Low-Volatility
    holdings: List[Holding]
    expected_return: float
    risk_score: float

class AnalysisResult(BaseModel):
    diversification: DiversificationMetrics
    risk_profile: RiskMetrics
    sector_alerts: List[str]
    overexposure_warnings: List[str]
    volatility_forecast: Dict[str, float] # historical, simulated
    simulation: SimulationResult
    rebalancing_suggestions: List[RebalancingSuggestion]
    correlation_matrix: Dict[str, Dict[str, float]]
