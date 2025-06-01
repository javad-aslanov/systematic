"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Cpu, ArrowsCross, ChartPie, Code, Loader } from 'tabler-icons-react';
import Overview from 'kbar/example/src/Docs/Overview';
import PageContainer from '@/components/layout/page-container';

// Supported exchanges and trading pairs
const exchanges = ['Binance', 'Coinbase Pro', 'Kraken'];
const pairs = ['BTC/USDT', 'ETH/USDT'];

// Strategy definitions with parameters and descriptions
const strategyDefs = [
  {
    name: 'Momentum Strategy',
    icon: TrendingUp,
    description: 'Applies momentum breakout logic on selected crypto pairs.',
    params: [
      { key: 'lookback', label: 'Lookback Period (minutes)', default: 60 },
      { key: 'threshold', label: 'Momentum Threshold (%)', default: 1 },
    ],
  },
  {
    name: 'Mean Reversion Strategy',
    icon: Cpu,
    description: 'Enters on deviations from mean price over rolling window.',
    params: [
      { key: 'window', label: 'Window Size (minutes)', default: 30 },
      { key: 'zscore', label: 'Entry Z-Score', default: 1.5 },
    ],
  },
  {
    name: 'Arbitrage Bot',
    icon: ArrowsCross,
    description: 'Exploits price differences across tier-1 exchanges.',
    params: [
      { key: 'spread', label: 'Min Spread ($)', default: 0.50 },
      { key: 'maxPositions', label: 'Max Concurrent Positions', default: 3 },
    ],
  },
];

export default function Page() {
  const [active, setActive] = useState(strategyDefs[0].name);

  // Default configuration state per strategy
  const [configs, setConfigs] = useState(
    strategyDefs.reduce((acc, s) => {
      acc[s.name] = Object.fromEntries(s.params.map(p => [p.key, p.default]));
      return acc;
    }, {} as Record<string, Record<string, number>>)
  );
  const [pair, setPair] = useState(pairs[0]);
  const [exchange, setExchange] = useState(exchanges[0]);

  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  // Performance metrics state
  const [metrics, setMetrics] = useState<{
    winRate: string;
    monthlyReturn: string;
    maxDrawdown: string;
    profitFactor: string;
    sharpeRatio: string;
  } | null>(null);

  // Backtest threads
  const [threads, setThreads] = useState(4);

  // Signal generation state
  const [signalState, setSignalState] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [signalCount, setSignalCount] = useState(0);

  const handleParamChange = (strategy: string, key: string, value: number) => {
    setConfigs(prev => ({
      ...prev,
      [strategy]: { ...prev[strategy], [key]: value }
    }));
  };

  // Run the selected strategy with current settings
  const run = (name: string) => {
    const params = configs[name];
    const now = new Date().toLocaleTimeString();
    setStatus('running');
    setLogs([`[${now}] 🚀 Running ${name} on ${pair} @ ${exchange}`]);
    setMetrics(null);

    setTimeout(() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📊 Loading historical OHLCV data (${params.lookback || params.window}m)`]), 800);
    setTimeout(() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🧮 Calculating indicators`]), 1600);
    setTimeout(() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔄 Generating entry/exit signals`]), 2400);
    setTimeout(() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 💱 Executing simulated trades`]), 3200);
    setTimeout(() => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ ${name} run complete`]);
      setStatus('completed');
      // Generate sample performance metrics within target ranges
      setMetrics({
        winRate: `${(Math.random() * 0.1 + 0.65).toFixed(2)}`,
        monthlyReturn: `${(Math.random() * 0.03 + 0.05).toFixed(2)}`,
        maxDrawdown: `-${(Math.random() * 0.1 + 0.05).toFixed(2)}`,
        profitFactor: `${(Math.random() * 0.5 + 1.5).toFixed(2)}`,
        sharpeRatio: `${(Math.random() * 0.5 + 1.1).toFixed(2)}`,
      });
    }, 4000);
  };

  // Simulate live signal generation
  const generateSignals = () => {
    setSignalState('generating');
    setSignalCount(0);
    setTimeout(() => {
      const count = Math.floor(Math.random() * 10 + 5);
      setSignalCount(count);
      setSignalState('ready');
    }, 2000);
  };

  const activeDef = strategyDefs.find(s => s.name === active)!;

  return (
    <PageContainer>

    <div className="p-8 space-y-6 max-w-6xl mx-auto overflow-scroll">
      <h1 className="text-4xl font-bold text-white">Strategy</h1>


      {/* Strategy Selection */}
      <Tabs value={active} onValueChange={setActive} className="mb-6">
        <TabsList>
          {strategyDefs.map(s => (
            <TabsTrigger key={s.name} value={s.name} className="flex items-center space-x-2 text-white">
              <s.icon size={18} />
              <span>{s.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Config */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">{activeDef.name} Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pair & Exchange selection */}
            <div className="flex space-x-4">
              <div className="flex flex-col">
                <label className="text-white mb-1">Trading Pair</label>
                <select
                  value={pair}
                  onChange={e => setPair(e.target.value)}
                  className="bg-gray-800 text-white p-2 rounded"
                >
                  {pairs.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-white mb-1">Exchange</label>
                <select
                  value={exchange}
                  onChange={e => setExchange(e.target.value)}
                  className="bg-gray-800 text-white p-2 rounded"
                >
                  {exchanges.map(ex => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Dynamic params */}
            {activeDef.params.map(p => (
              <div key={p.key} className="flex flex-col">
                <label className="text-white mb-1">{p.label}</label>
                <Input
                  type="number"
                  value={configs[active][p.key]}
                  onChange={e => handleParamChange(active, p.key, parseFloat(e.target.value))}
                />
              </div>
            ))}
            <Button onClick={() => run(active)} variant="secondary" className="mt-4 w-full">
              Run {activeDef.name}
            </Button>
          </CardContent>
        </Card>

        {/* Execution Engine */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code size={20} className="text-white" />
              <CardTitle className="text-white">Execution Engine</CardTitle>
            </div>
            <Badge
              variant={status === 'running' ? 'outline' : status === 'completed' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {status}
            </Badge>
          </CardHeader>
          <CardContent>
            <ul className="h-48 overflow-auto space-y-2 p-4 bg-gray-800 rounded-lg">
              {logs.map((l, i) => (
                <li key={i} className="text-sm text-gray-100">{l}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Backtesting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Backtesting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">Parallel backtests with adjustable threads:</p>
            <div className="mt-4">
              <Slider
                value={[threads]}
                onValueChange={val => setThreads(val[0])}
                max={16}
                step={1}
                className="w-full"
              />
              <p className="text-xs mt-2 text-white">Threads: {threads}</p>
            </div>
            <Button className="mt-4 w-full">Start Backtest</Button>
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ChartPie size={20} className="text-white" />
              <CardTitle className="text-white">Performance Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics ? (
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-800">
                  <CardContent>
                    <h3 className="text-sm font-medium text-gray-100">Win Rate</h3>
                    <p className="text-2xl font-bold text-green-400">{metrics.winRate}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800">
                  <CardContent>
                    <h3 className="text-sm font-medium text-gray-100">Monthly Return</h3>
                    <p className="text-2xl font-bold text-green-400">{metrics.monthlyReturn}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800">
                  <CardContent>
                    <h3 className="text-sm font-medium text-gray-100">Max Drawdown</h3>
                    <p className="text-2xl font-bold text-red-400">{metrics.maxDrawdown}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800">
                  <CardContent>
                    <h3 className="text-sm font-medium text-gray-100">Profit Factor</h3>
                    <p className="text-2xl font-bold text-blue-400">{metrics.profitFactor}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 col-span-2">
                  <CardContent>
                    <h3 className="text-sm font-medium text-gray-100">Sharpe Ratio</h3>
                    <p className="text-2xl font-bold text-indigo-400">{metrics.sharpeRatio}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-white">Run a strategy to see performance metrics.</p>
            )}
            <Button className="mt-4 w-full">View Full Dashboard</Button>
          </CardContent>
        </Card>

        {/* Signal Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Signal Module</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white">Generate real-time ML-based trading signals.</p>
            <Button
              onClick={generateSignals}
              disabled={signalState === 'generating'}
              className="w-full flex items-center justify-center"
            >
              {signalState === 'generating' ? <Loader className="animate-spin text-white" size={16} /> : 'Generate Signals'}
            </Button>
            {signalState === 'ready' && (
              <p className="mt-2 text-sm text-white">Generated {signalCount} signals for deployment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </PageContainer>
  );
}
