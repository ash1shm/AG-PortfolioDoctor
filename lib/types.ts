export interface Holding {
    ticker: string;
    weight: number;
}

export interface PortfolioInput {
    holdings: Holding[];
}

export interface RiskMetrics {
    beta: number;
    volatility: number;
    sharpe_ratio: number;
    var_95: number;
    max_drawdown: number;
}

export interface DiversificationMetrics {
    score: number;
    sector_allocation: Record<string, number>;
    concentration_index: number;
}

export interface SimulationResult {
    cagr: number;
    volatility: number;
    worst_case_percentile: number;
    median_return: number;
    sharpe_ratio: number;
}

export interface RebalancingSuggestion {
    type: string;
    holdings: Holding[];
    expected_return: number;
    risk_score: number;
}

export interface AnalysisResult {
    diversification: DiversificationMetrics;
    risk_profile: RiskMetrics;
    sector_alerts: string[];
    overexposure_warnings: string[];
    volatility_forecast: {
        historical: number;
        simulated: number;
    };
    simulation: SimulationResult;
    rebalancing_suggestions: RebalancingSuggestion[];
    correlation_matrix: Record<string, Record<string, number>>;
}
