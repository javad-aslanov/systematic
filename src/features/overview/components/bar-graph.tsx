'use client';

import * as React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

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

// Function to generate data starting from today, minute by minute
const generateInitialMinuteData = () => {
  const today = new Date();
  today.setHours(today.getHours() - 1, today.getMinutes(), 0, 0); // Start of today

  const data = [];
  // Generate 90 data points (90 minutes)
  for (let i = 0; i < 60; i++) {
    const timestamp = new Date(today);
    timestamp.setMinutes(timestamp.getMinutes() + i);

    data.push({
      timestamp: timestamp.toISOString(),
      volatility: Math.floor(Math.random() * (500 - 50 + 1)) + 50,
      hypeIndex: Math.floor(Math.random() * (550 - 100 + 1)) + 100
    });
  }

  return data;
};

const initialChartData = generateInitialMinuteData();

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

// Function to generate a new timestamp one minute later
const getNextMinute = (lastTimestamp) => {
  const date = new Date(lastTimestamp);
  date.setMinutes(date.getMinutes() + 1);
  return date.toISOString();
};

// Function to generate random data within range
const generateRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('volatility');

  const [chartData, setChartData] = React.useState(initialChartData);

  // State for dynamic totals
  const [dynamicTotals, setDynamicTotals] = React.useState({
    volatility: initialChartData.reduce((acc, curr) => acc + curr.volatility, 0),
    hypeIndex: initialChartData.reduce((acc, curr) => acc + curr.hypeIndex, 0)
  });

  // State for trend indicators
  const [trends, setTrends] = React.useState({
    volatility: 0, // 1 for up, -1 for down, 0 for neutral
    hypeIndex: 0
  });

  const [isClient, setIsClient] = React.useState(false);

  // Update client-side rendering state
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect to add a new datapoint every minute
  React.useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setChartData(prevData => {
        // Get the last timestamp in the dataset
        const lastTimestamp = prevData[prevData.length - 1].timestamp;
        const nextTimestamp = getNextMinute(lastTimestamp);

        // Generate new random values
        const newVolatilityValue = generateRandomValue(50, 500);
        const newHypeIndexValue = generateRandomValue(100, 550);

        // Create a new data point
        const newDataPoint = {
          timestamp: nextTimestamp,
          volatility: newVolatilityValue,
          hypeIndex: newHypeIndexValue
        };

        // Add new data point and remove the oldest to maintain consistent dataset size
        const updatedData = [...prevData.slice(1), newDataPoint];

        // Update totals
        setDynamicTotals(prevTotals => {
          // Compare with previous last datapoint to determine trend
          const prevLastPoint = prevData[prevData.length - 1];

          setTrends({
            volatility: newVolatilityValue > prevLastPoint.volatility ? 1 : newVolatilityValue < prevLastPoint.volatility ? -1 : 0,
            hypeIndex: newHypeIndexValue > prevLastPoint.hypeIndex ? 1 : newHypeIndexValue < prevLastPoint.hypeIndex ? -1 : 0
          });

          return {
            volatility: updatedData.reduce((acc, curr) => acc + curr.volatility, 0),
            hypeIndex: updatedData.reduce((acc, curr) => acc + curr.hypeIndex, 0)
          };
        });

        return updatedData;
      });
    }, 60000); // Add new datapoint every minute (60000 ms)

    return () => clearInterval(interval);
  }, [isClient]);

  if (!isClient) {
    return null;
  }

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
          {['volatility', 'hypeIndex'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || dynamicTotals[key as keyof typeof dynamicTotals] === 0) return null;

            // Get trend direction for current metric
            const trendDirection = trends[key as keyof typeof trends];
            let trendColor = "text-gray-500"; // Neutral
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
                    {dynamicTotals[key as keyof typeof dynamicTotals]?.toLocaleString()}
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