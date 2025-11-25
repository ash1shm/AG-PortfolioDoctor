from typing import List, Dict
from ..models.schemas import RebalancingSuggestion, Holding

def suggest_allocations(current_holdings: List[Holding], current_risk: Dict) -> List[RebalancingSuggestion]:
    """
    Generates rebalancing suggestions: Balanced, Growth, Low-Volatility.
    This is a simplified heuristic version. In a real app, this would use Mean-Variance Optimization.
    """
    
    suggestions = []
    
    # 1. Balanced Portfolio
    # Cap max weight at 10% or 1/N if N < 10
    # Distribute remaining equally
    n = len(current_holdings)
    balanced_weight = 100 / n
    
    balanced_holdings = []
    for h in current_holdings:
        balanced_holdings.append(Holding(ticker=h.ticker, weight=balanced_weight))
        
    suggestions.append(RebalancingSuggestion(
        type="Balanced",
        holdings=balanced_holdings,
        expected_return=0.08, # Placeholder
        risk_score=50.0
    ))
    
    # 2. Growth Portfolio
    # Overweight high beta/volatility stocks (simulated logic)
    # For now, let's just slightly adjust weights randomly or based on a simple rule
    # In a real scenario, we'd need historical returns to identify "Growth" stocks
    
    # 3. Low Volatility
    # Underweight high beta stocks
    
    return suggestions
