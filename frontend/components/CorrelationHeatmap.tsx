import React from 'react';
// Simple table-based heatmap (no external library)
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { AnalysisResult } from '@/lib/types';

interface CorrelationHeatmapProps {
    data: AnalysisResult['correlation_matrix'];
}

// Helper function to get background color based on correlation value
const getCorrelationColor = (value: number): string => {
    // Normalize value from -1 to 1 to 0 to 1 scale
    const normalized = (value + 1) / 2;

    if (value >= 0.7) {
        // Strong positive correlation - Dark blue
        return 'bg-blue-700 text-white';
    } else if (value >= 0.4) {
        // Moderate positive correlation - Medium blue
        return 'bg-blue-500 text-white';
    } else if (value >= 0.1) {
        // Weak positive correlation - Light blue
        return 'bg-blue-200 text-gray-900';
    } else if (value >= -0.1) {
        // Near zero correlation - Very light gray
        return 'bg-gray-100 text-gray-900';
    } else if (value >= -0.4) {
        // Weak negative correlation - Light red
        return 'bg-red-200 text-gray-900';
    } else if (value >= -0.7) {
        // Moderate negative correlation - Medium red
        return 'bg-red-500 text-white';
    } else {
        // Strong negative correlation - Dark red
        return 'bg-red-700 text-white';
    }
};

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ data }) => {
    const tickers = Object.keys(data);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-serif text-primary">Correlation Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
                <div className="mb-4 flex items-center gap-4 text-xs text-gray-600">
                    <span className="font-medium">Legend:</span>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-red-700 rounded"></div>
                        <span>Strong Negative</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                        <span>Neutral</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-700 rounded"></div>
                        <span>Strong Positive</span>
                    </div>
                </div>
                <table className="min-w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="px-3 py-2 bg-gray-50 border border-gray-200 font-serif text-primary"></th>
                            {tickers.map((t) => (
                                <th
                                    key={t}
                                    className="px-3 py-2 bg-gray-50 border border-gray-200 font-semibold text-primary"
                                    title={t}
                                >
                                    {t}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tickers.map((row) => (
                            <tr key={row}>
                                <td className="px-3 py-2 border border-gray-200 font-semibold bg-gray-50 text-primary" title={row}>
                                    {row}
                                </td>
                                {tickers.map((col) => {
                                    const val = data[row]?.[col];
                                    const displayVal = val !== undefined ? val.toFixed(2) : '';
                                    const colorClass = val !== undefined ? getCorrelationColor(val) : 'bg-white';

                                    return (
                                        <td
                                            key={col}
                                            className={`px-3 py-2 border border-gray-200 text-center font-medium transition-all hover:opacity-80 ${colorClass}`}
                                            title={`${row} vs ${col}: ${displayVal}`}
                                        >
                                            {displayVal}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};
