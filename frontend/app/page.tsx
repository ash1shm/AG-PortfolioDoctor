'use client';

import React, { useState } from 'react';
import { HoldingsInput } from '@/components/HoldingsInput';
import { Dashboard } from '@/components/Dashboard';
import { analyzePortfolio } from '@/lib/api';
import { AnalysisResult, Holding } from '@/lib/types';
import { Activity, Shield, TrendingUp, PieChart } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (holdings: Holding[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzePortfolio({ holdings });
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to analyze portfolio. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-background text-foreground selection:bg-primary/10">
        {/* Background Effects - Subtle Light Gradient */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
          {/* Header / Hero */}
          {!data && (
            <header className="text-center space-y-6 py-12 md:py-20">
              <div className="inline-flex items-center justify-center p-4 bg-white rounded-full mb-4 shadow-lg ring-1 ring-gray-100">
                <Activity className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-primary">
                AI Portfolio Doctor
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                Advanced diagnostics & health report for your investments.
                <br className="hidden md:block" />
                Analyze risk, simulate returns, and optimize allocation in seconds.
              </p>
            </header>
          )}

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          {/* Main Content */}
          {!data ? (
            <div className="max-w-2xl mx-auto space-y-16">
              <HoldingsInput onSubmit={handleAnalyze} isLoading={isLoading} />

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <Shield className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-serif font-semibold text-lg mb-2 text-primary">Risk Fingerprint</h3>
                  <p className="text-sm text-gray-600">Analyze VaR, Beta, and Volatility with institutional-grade precision.</p>
                </div>
                <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <TrendingUp className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="font-serif font-semibold text-lg mb-2 text-primary">Monte Carlo Sim</h3>
                  <p className="text-sm text-gray-600">Project future returns using 1000+ stochastic simulations.</p>
                </div>
                <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <PieChart className="w-8 h-8 text-indigo-500 mb-4" />
                  <h3 className="font-serif font-semibold text-lg mb-2 text-primary">Smart Rebalancing</h3>
                  <p className="text-sm text-gray-600">Get actionable AI suggestions to optimize your asset allocation.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-primary">Health Report</h2>
                    <p className="text-sm text-gray-500">Comprehensive analysis generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setData(null)}
                  className="hover:bg-gray-50"
                >
                  Analyze Another Portfolio
                </Button>
              </div>
              <Dashboard data={data} />
            </div>
          )}
        </div>
      </main>
    </ErrorBoundary>
  );
}
