import React from 'react';
import { AnalysisResult } from '../lib/types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { AlertTriangle, TrendingUp, Shield, Activity, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { RiskCard } from './RiskCard';
import { CorrelationHeatmap } from './CorrelationHeatmap';
import { SimulationChart } from './SimulationChart';
import { cn } from '@/lib/utils';

interface DashboardProps {
    data: AnalysisResult;
}

const COLORS = ['#004185', '#DB1830', '#F6A181', '#8999CC', '#57565B', '#A4A4A4'];

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const sectorData = Object.entries(data.diversification.sector_allocation).map(([name, value]) => ({
        name,
        value
    }));

    return (
        <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Diversification Score</p>
                                <h2 className="text-3xl font-bold mt-2">{data.diversification.score.toFixed(0)}/100</h2>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-full">
                                <PieIcon className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Expected CAGR</p>
                                <h2 className="text-3xl font-bold text-green-500 mt-2">{(data.simulation.cagr * 100).toFixed(1)}%</h2>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-full">
                                <TrendingUp className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Risk (VaR 95%)</p>
                                <h2 className="text-3xl font-bold text-red-500 mt-2">{(data.risk_profile.var_95 * 100).toFixed(1)}%</h2>
                            </div>
                            <div className="p-3 bg-red-500/10 rounded-full">
                                <Shield className="h-6 w-6 text-red-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                                <h2 className="text-3xl font-bold text-purple-500 mt-2">{data.risk_profile.sharpe_ratio.toFixed(2)}</h2>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-full">
                                <Activity className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            {(data.sector_alerts.length > 0 || data.overexposure_warnings.length > 0) && (
                <Card className="border-l-4 border-l-secondary bg-red-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-secondary">
                            <AlertTriangle className="w-5 h-5" />
                            Portfolio Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {data.sector_alerts.map((alert, i) => (
                                <li key={`sec-${i}`}>{alert}</li>
                            ))}
                            {data.overexposure_warnings.map((warn, i) => (
                                <li key={`over-${i}`}>{warn}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sector Allocation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif text-primary">Sector Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sectorData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {sectorData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderColor: '#e5e7eb',
                                                borderRadius: '0.5rem',
                                                color: '#1f2937'
                                            }}
                                            itemStyle={{ color: '#1f2937' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {sectorData.sort((a, b) => b.value - a.value).map((entry, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full shadow-sm"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{entry.value.toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rebalancing Suggestions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif text-primary">Rebalancing Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.rebalancing_suggestions.map((sugg, i) => (
                                <div key={i} className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-primary">{sugg.type} Strategy</h4>
                                        <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                                            Exp. Return: {(sugg.expected_return * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Risk Score: {sugg.risk_score.toFixed(0)}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {sugg.holdings.slice(0, 3).map((h, idx) => (
                                            <span key={idx} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-700">
                                                {h.ticker} {h.weight.toFixed(0)}%
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Risk Profile */}
            <RiskCard risk={data.risk_profile} />

            {/* Correlation Heatmap */}
            <CorrelationHeatmap data={data.correlation_matrix} />

            {/* Simulation Results */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-serif text-primary">Monte Carlo Simulation (1 Year Forecast)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-sm text-red-600 font-medium mb-1">Worst Case (5th %)</p>
                        <p className="text-2xl font-bold text-red-700">{(data.simulation.worst_case_percentile * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-600 font-medium mb-1">Median Case</p>
                        <p className="text-2xl font-bold text-blue-700">{(data.simulation.median_return * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-600 font-medium mb-1">Volatility</p>
                        <p className="text-2xl font-bold text-gray-800">{(data.simulation.volatility * 100).toFixed(1)}%</p>
                    </div>
                </CardContent>
            </Card>

            {/* Simulation Chart */}
            <SimulationChart simulationData={generateMockSimulationData(data.simulation)} />
        </div>
    );
};

// Helper to generate mock time‑series data for the SimulationChart
function generateMockSimulationData(sim: any) {
    const points = [] as { date: string; value: number }[];
    const base = 100;
    const volatility = sim.volatility || 0.2;
    for (let i = 0; i <= 12; i++) {
        const date = `${i}M`;
        const factor = Math.exp((Math.random() - 0.5) * volatility);
        const value = base * Math.pow(1 + (sim.cagr || 0.08) / 12, i) * factor;
        points.push({ date, value: parseFloat(value.toFixed(2)) });
    }
    return points;
}
