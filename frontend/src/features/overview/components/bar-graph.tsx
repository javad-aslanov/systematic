'use client';

import * as React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive line chart with live updates';

const chartConfig = {
  views: {
    label: 'Change in Price'
  },
  volatility: {
    label: 'Volatility',
    color: 'var(--primary)'
  },
  hypeIndex: {
    label: 'Hype Index',
    color: 'var(--muted-foreground)'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('volatility');
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [dynamicTotals, setDynamicTotals] = React.useState({ volatility: 0, hypeIndex: 0 });
  const [trends, setTrends] = React.useState({ volatility: 0, hypeIndex: 0 });
  const [isClient, setIsClient] = React.useState(false);

  // Ensure we're running client-side
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch chart data from backend
  React.useEffect(() => {
    if (!isClient) return;

    const fetchChartData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/market-metrics");
        const data = await res.json();
        setChartData(Array.isArray(data) ? data : []);
      } catch (error) {
        setChartData([]);
      }
    };
    fetchChartData();
    const interval = setInterval(fetchChartData, 60000); // every 1 minute
    return () => clearInterval(interval);
  }, [isClient]);

  // Compute totals and trends after each chartData update
  React.useEffect(() => {
    if (!chartData.length) return;

    const volatilityTotal = chartData.reduce((acc, curr) => acc + curr.volatility, 0);
    const hypeIndexTotal = chartData.reduce((acc, curr) => acc + curr.hypeIndex, 0);
    setDynamicTotals({ volatility: volatilityTotal, hypeIndex: hypeIndexTotal });

    if (chartData.length > 1) {
      const prev = chartData[chartData.length - 2];
      const last = chartData[chartData.length - 1];
      setTrends({
        volatility: last.volatility > prev.volatility ? 1 : last.volatility < prev.volatility ? -1 : 0,
        hypeIndex: last.hypeIndex > prev.hypeIndex ? 1 : last.hypeIndex < prev.hypeIndex ? -1 : 0
      });
    } else {
      setTrends({ volatility: 0, hypeIndex: 0 });
    }
  }, [chartData]);

  if (!isClient) return null;

  return (
    <Card className="@container/card !pt-3">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 !py-0">
          <CardTitle>Live Market Metrics</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Real-time data updating every minute
            </span>
            <span className="@[540px]/card:hidden">Real-time data</span>
          </CardDescription>
        </div>
        <div className="flex">
          {(['volatility', 'hypeIndex'] as const).map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || dynamicTotals[key] === 0) return null;

            // Trend styling
            const trendDirection = trends[key];
            let trendColor = "text-gray-500";
            let trendIcon = "→";
            if (trendDirection > 0) {
              trendColor = "text-green-500";
              trendIcon = "↑";
            } else if (trendDirection < 0) {
              trendColor = "text-red-500";
              trendIcon = "↓";
            }

            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <div className="flex items-center">
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {dynamicTotals[key]?.toLocaleString()}
                  </span>
                  <span className={`ml-2 text-lg font-bold ${trendColor}`}>
                    {trendIcon}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12
            }}
          >
            <defs>
              <linearGradient id="colorVolatility" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorHypeIndex" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                <stop offset="95%" stopColor="red" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '5 5' }}
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    });
                  }}
                />
              }
            />
            {activeChart === 'volatility' && (
              <Line
                type="monotone"
                dataKey="volatility"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
            {activeChart === 'hypeIndex' && (
              <Line
                type="monotone"
                dataKey="hypeIndex"
                stroke="red"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
