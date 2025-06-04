"use client";

import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function EquityCurveGraph() {
  const [equityData, setEquityData] = useState<any>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('macrossover');
  const [chartData, setChartData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [performanceTrend, setPerformanceTrend] = useState({
    change: 0,
    positive: false
  });

  // Ensure component is client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch graph data from backend
  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/equity-curve");
        const data = await res.json();
        setEquityData(data);
        setSelectedStrategy(Object.keys(data)[0]); // Default to first strategy
      } catch (error) {
        setEquityData(null);
      }
    };
    fetchGraph();
  }, []);

  // Update chart data and performance trend when data/strategy changes
  useEffect(() => {
    if (!isClient || !equityData) return;
    const data = equityData[selectedStrategy]?.data || [];
    setChartData(data);

    if (data.length > 1) {
      const firstValue = data[0].equity;
      const lastValue = data[data.length - 1].equity;
      const change = lastValue - firstValue;
      setPerformanceTrend({
        change: Math.abs(Number(change.toFixed(2))),
        positive: change >= 0
      });
    }
  }, [selectedStrategy, isClient, equityData]);

  // Chart configuration
  const chartConfig: ChartConfig = {
    equity: { label: 'Equity (USD)' }
  };

  const formatCurrency = (value: number) => {
    if (value < 1_000) {
      return `$${value.toFixed(2)}`;
    }
    return `$${Math.round(value).toLocaleString()}`;
  };

  const calculateDrawdown = () => {
    if (!chartData.length) return 0;
    let peak = chartData[0].equity;
    let maxDd = 0;
    chartData.forEach(({ equity }) => {
      if (equity > peak) peak = equity;
      const dd = (peak - equity) / peak;
      if (dd > maxDd) maxDd = dd;
    });
    return Number((maxDd * 100).toFixed(1));
  };

  const maxDrawdown = calculateDrawdown();

  if (!isClient || !equityData) return null;

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Equity Curve Comparison</CardTitle>
            <CardDescription>
              Historical equity performance of selected strategy
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
              <SelectTrigger className="w-96 h-12">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: equityData[selectedStrategy].color }}
                  ></div>
                  <SelectValue>{equityData[selectedStrategy].name}</SelectValue>
                  <Badge
                    variant="outline"
                    className={
                      performanceTrend.positive
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }
                  >
                    {performanceTrend.positive ? '+' : '-'}${performanceTrend.change.toLocaleString()}
                  </Badge>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.keys(equityData).map((key) => (
                  <SelectItem key={key} value={key} className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: equityData[key].color }}
                      ></div>
                      {equityData[key].name}
                      <Badge
                        variant="outline"
                        className={
                          equityData[key].data[equityData[key].data.length - 1].equity -
                          equityData[key].data[0].equity >= 0
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-red-100 text-red-800 hover:bg-red-100'
                        }
                      >
                        {equityData[key].data[equityData[key].data.length - 1].equity -
                        equityData[key].data[0].equity >= 0
                          ? '+'
                          : '-'}$
                        {Math.abs(
                          equityData[key].data[equityData[key].data.length - 1].equity -
                          equityData[key].data[0].equity
                        ).toLocaleString()}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Timeframe: January - September 2024
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            {performanceTrend.positive ? (
              <IconTrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <IconTrendingDown className="h-4 w-4 text-red-500" />
            )}
            Net Change: {performanceTrend.positive ? '+' : '-'}$
            {performanceTrend.change.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Max Drawdown: {maxDrawdown}%
          </div>
        </div>
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12, top: 20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="fillEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={equityData[selectedStrategy].color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={equityData[selectedStrategy].color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 5%', 'dataMax + 5%']}
              tickFormatter={(value) => formatCurrency(Number(value))}
              label={{ value: 'Equity (USD)', angle: -90, position: 'insideLeft', offset: -5 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => {
                    if (name === 'equity') return formatCurrency(Number(value));
                    return value;
                  }}
                />
              }
            />
            <Area
              dataKey="equity"
              type="monotone"
              fill="url(#fillEquity)"
              stroke={equityData[selectedStrategy].color}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col sm:flex-row items-start justify-between gap-2 text-sm">
          <div className="text-muted-foreground">
            Generated by backend
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: equityData[selectedStrategy].color }}
              ></div>
              <span>Equity Curve</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
