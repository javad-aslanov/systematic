'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

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

// Distribution of flagged rug pull incidents by blockchain
const chartData = [
  { chain: 'Ethereum', cases: 45, fill: 'red' },
  { chain: 'Binance Smart Chain', cases: 30, fill: 'green' },
  { chain: 'Solana', cases: 15, fill: 'blue' },
  { chain: 'Polygon', cases: 10, fill: 'white' },
  { chain: 'Other', cases: 5, fill: 'var(--muted)' }
];

const chartConfig = {
  cases: { label: 'Rug Pull Cases' },
  Ethereum: { label: 'Ethereum', color: 'var(--danger)' },
  'Binance Smart Chain': { label: 'BSC', color: 'var(--warning)' },
  Solana: { label: 'Solana', color: 'var(--success)' },
  Polygon: { label: 'Polygon', color: 'var(--cyan)' },
  Other: { label: 'Other', color: 'var(--muted)' }
} satisfies ChartConfig;

export function PieGraph() {
  const totalCases = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.cases, 0),
    []
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Flagged Incidents</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Distribution of flagged incidents by blockchain network
          </span>
          <span className="@[540px]/card:hidden">
            Rug pull distribution
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData.map(item => ({ ...item, fill: item.fill }))}
              dataKey="cases"
              nameKey="chain"
              innerRadius={60}
              strokeWidth={2}
              stroke="var(--background)"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    const { cx, cy } = viewBox;
                    return (
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={cx} y={cy} className="fill-foreground text-3xl font-bold">
                          {totalCases}
                        </tspan>
                        <tspan x={cx} y={cy + 24} className="fill-muted-foreground text-sm">
                          Total Cases
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Ethereum accounts for{' '}
          {((chartData[0].cases / totalCases) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className="h-4 w-4 text-danger" />
        </div>
        <div className="text-muted-foreground leading-none">
          Data from most recent SEC surveillance period
        </div>
      </CardFooter>
    </Card>
  );
}
