import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Holding } from '../lib/types';
import { Upload, Play, Plus, Trash2, FileJson, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HoldingsInputProps {
    onSubmit: (holdings: Holding[]) => void;
    isLoading: boolean;
}

const EXAMPLE_HOLDINGS = [
    { ticker: "AAPL", weight: 25 },
    { ticker: "MSFT", weight: 15 },
    { ticker: "AMZN", weight: 10 },
    { ticker: "XOM", weight: 20 },
    { ticker: "JNJ", weight: 30 }
];

type InputMode = 'form' | 'json';

export const HoldingsInput: React.FC<HoldingsInputProps> = ({ onSubmit, isLoading }) => {
    const [mode, setMode] = useState<InputMode>('form');
    const [holdings, setHoldings] = useState<Holding[]>([
        { ticker: '', weight: 0 }
    ]);
    const [jsonInput, setJsonInput] = useState(JSON.stringify(EXAMPLE_HOLDINGS, null, 2));
    const [error, setError] = useState<string | null>(null);

    const addHolding = () => {
        setHoldings([...holdings, { ticker: '', weight: 0 }]);
    };

    const removeHolding = (index: number) => {
        if (holdings.length > 1) {
            setHoldings(holdings.filter((_, i) => i !== index));
        }
    };

    const updateHolding = (index: number, field: 'ticker' | 'weight', value: string | number) => {
        const updated = [...holdings];
        updated[index] = { ...updated[index], [field]: value };
        setHoldings(updated);
    };

    const loadExample = () => {
        setHoldings(EXAMPLE_HOLDINGS);
        setError(null);
    };

    const handleFormSubmit = () => {
        try {
            // Validate holdings
            const validHoldings = holdings.filter(h => h.ticker.trim() !== '');

            if (validHoldings.length === 0) {
                setError('Please add at least one holding');
                return;
            }

            const totalWeight = validHoldings.reduce((sum, h) => sum + Number(h.weight), 0);
            if (Math.abs(totalWeight - 100) > 1) {
                setError(`Total weight is ${totalWeight.toFixed(1)}%, must equal 100%`);
                return;
            }

            setError(null);
            onSubmit(validHoldings);
        } catch (e) {
            setError('Invalid input');
        }
    };

    const handleJsonSubmit = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error("Input must be an array");

            // Helper to normalize keys
            const normalize = (obj: any): any => {
                const newObj: any = {};
                Object.keys(obj).forEach(key => {
                    const lower = key.toLowerCase().trim();
                    if (['ticker', 'symbol', 'stock'].includes(lower)) {
                        newObj.ticker = obj[key];
                    } else if (['weight', 'allocation', 'value', 'weight %', 'weight%'].includes(lower)) {
                        newObj.weight = obj[key];
                    }
                });
                return newObj;
            };

            // Normalize and sanitize
            const sanitized = parsed.map((h: any) => {
                const normalized = normalize(h);
                return {
                    ticker: normalized.ticker || '',
                    weight: Number(normalized.weight) || 0
                };
            }).filter(h => h.ticker && h.weight > 0); // Filter out invalid entries

            if (sanitized.length === 0) {
                setError("No valid holdings found. Please check your JSON keys (expected 'ticker' and 'weight').");
                return;
            }

            const totalWeight = sanitized.reduce((sum: number, h: any) => sum + h.weight, 0);
            if (Math.abs(totalWeight - 100) > 1) {
                setError(`Total weight is ${totalWeight.toFixed(1)}%, must be 100%`);
                return;
            }

            setError(null);
            onSubmit(sanitized);
        } catch (e) {
            setError("Invalid JSON format");
        }
    };

    const totalWeight = holdings.reduce((sum, h) => sum + Number(h.weight || 0), 0);

    return (
        <Card className="w-full max-w-2xl mx-auto border-gray-200 shadow-lg">
            <CardHeader className="border-b border-gray-100 pb-4 bg-gray-50/50">
                <CardTitle className="flex items-center gap-3 text-xl font-serif text-primary">
                    <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <Upload className="w-5 h-5 text-primary" />
                    </div>
                    Upload Holdings
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {/* Mode Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setMode('form')}
                            className={cn(
                                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                                mode === 'form'
                                    ? "bg-white text-primary shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <PieChart className="w-4 h-4" />
                                Form Input
                            </div>
                        </button>
                        <button
                            onClick={() => setMode('json')}
                            className={cn(
                                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                                mode === 'json'
                                    ? "bg-white text-primary shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FileJson className="w-4 h-4" />
                                JSON Input
                            </div>
                        </button>
                    </div>

                    {/* Form Mode */}
                    {mode === 'form' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <p className="text-sm text-gray-600">
                                    Total Allocation: <span className={cn(
                                        "font-bold ml-1",
                                        Math.abs(totalWeight - 100) < 1 ? 'text-green-600' : 'text-red-600'
                                    )}>
                                        {totalWeight.toFixed(1)}%
                                    </span> / 100%
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={loadExample}
                                    className="text-primary hover:bg-blue-50"
                                >
                                    Load Example
                                </Button>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {holdings.map((holding, index) => (
                                    <div key={index} className="flex gap-3 items-center group">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder="Ticker (e.g., AAPL)"
                                                value={holding.ticker}
                                                onChange={(e) => updateHolding(index, 'ticker', e.target.value.toUpperCase())}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                            />
                                        </div>
                                        <div className="w-32 relative">
                                            <input
                                                type="number"
                                                placeholder="%"
                                                value={holding.weight || ''}
                                                onChange={(e) => updateHolding(index, 'weight', parseFloat(e.target.value) || 0)}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-right text-gray-900"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">%</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeHolding(index)}
                                            disabled={holdings.length === 1}
                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                onClick={addHolding}
                                className="w-full border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary hover:bg-blue-50"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Holding
                            </Button>
                        </div>
                    )}

                    {/* JSON Mode */}
                    {mode === 'json' && (
                        <div className="relative">
                            <textarea
                                className="w-full h-64 p-4 font-mono text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-gray-900"
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder='[{"ticker": "AAPL", "weight": 50}, {"ticker": "MSFT", "weight": 50}]'
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                                JSON Format
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        onClick={mode === 'form' ? handleFormSubmit : handleJsonSubmit}
                        isLoading={isLoading}
                        className="w-full py-6 text-base font-semibold shadow-lg shadow-primary/20"
                    >
                        {!isLoading && <Play className="w-4 h-4 mr-2 fill-current" />}
                        Analyze Portfolio
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
