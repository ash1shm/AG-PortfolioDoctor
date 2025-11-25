import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Shield, Activity, TrendingUp } from 'lucide-react';
import { RiskMetrics } from '@/lib/types';

interface RiskCardProps {
    risk: RiskMetrics;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" /> Risk Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">VaR (95%)</span>
                    <span className="font-medium text-red-600">{(risk.var_95 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Volatility</span>
                    <span className="font-medium text-blue-600">{(risk.volatility * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Beta</span>
                    <span className="font-medium text-green-600">{risk.beta?.toFixed(2) ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sharpe Ratio</span>
                    <span className="font-medium text-purple-600">{risk.sharpe_ratio?.toFixed(2) ?? 'N/A'}</span>
                </div>
            </CardContent>
        </Card>
    );
};
