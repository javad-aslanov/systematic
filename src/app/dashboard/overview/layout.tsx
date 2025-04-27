"use client"
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';

export default function OverViewLayout({
                                         sales,
                                         pie_stats,
                                         bar_stats,
                                         area_stats
                                       }: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  // Initial stat values
  const [stats, setStats] = useState({
    totalValue: 12450.75,
    totalValueChange: 12.5,
    activeTraders: 1234,
    activeTradersChange: -20,
    transactions: 45678,
    transactionsChange: 12.5,
    volatilityIndex: 4.5,
    volatilityChange: 4.5
  });

  // Effect to update stats slightly at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => {
        // Generate small random fluctuations (between -0.5% and +0.5%)
        const randomFluctuation = (value: number) => {
          const change = value * (Math.random() * 0.01 - 0.005);
          return Number((value + change).toFixed(2));
        };

        // For percentage changes, keep within logical bounds
        const randomPercentageFluctuation = (value: number) => {
          const change = Math.random() * 0.2 - 0.1; // Smaller fluctuation for percentages
          return Number((value + change).toFixed(1));
        };

        return {
          totalValue: randomFluctuation(prevStats.totalValue),
          totalValueChange: randomPercentageFluctuation(prevStats.totalValueChange),
          activeTraders: Math.round(randomFluctuation(prevStats.activeTraders)),
          activeTradersChange: randomPercentageFluctuation(prevStats.activeTradersChange),
          transactions: Math.round(randomFluctuation(prevStats.transactions)),
          transactionsChange: randomPercentageFluctuation(prevStats.transactionsChange),
          volatilityIndex: randomPercentageFluctuation(prevStats.volatilityIndex),
          volatilityChange: randomPercentageFluctuation(prevStats.volatilityChange)
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
Crypto Market Intelligence Dashboard
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {sales}
          </div>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>

        <div
          className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Exposure Value</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                ${stats.totalValue.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  {stats.totalValueChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                  {stats.totalValueChange >= 0 ? '+' : ''}{stats.totalValueChange}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {stats.totalValueChange >= 0 ? 'Bullish trend this week' : 'Bearish trend this week'}
                {stats.totalValueChange >= 0 ? <IconTrendingUp className='size-4' /> :
                  <IconTrendingDown className='size-4' />}
              </div>
              <div className='text-muted-foreground'>
                Market cap analysis for top tokens
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Active Traders</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.activeTraders.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  {stats.activeTradersChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                  {stats.activeTradersChange >= 0 ? '+' : ''}{stats.activeTradersChange}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {stats.activeTradersChange >= 0 ? 'Growing trader activity' : 'Decreasing trader activity'}
                {stats.activeTradersChange >= 0 ? <IconTrendingUp className='size-4' /> :
                  <IconTrendingDown className='size-4' />}
              </div>
              <div className='text-muted-foreground'>
                Exchange participation metrics
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>24h Transactions</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.transactions.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  {stats.transactionsChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                  {stats.transactionsChange >= 0 ? '+' : ''}{stats.transactionsChange}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {stats.transactionsChange >= 0 ? 'High network activity' : 'Slowing network activity'}
                {stats.transactionsChange >= 0 ? <IconTrendingUp className='size-4' /> :
                  <IconTrendingDown className='size-4' />}
              </div>
              <div className='text-muted-foreground'>
                Blockchain throughput analysis
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Volatility Index</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.volatilityIndex}%
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  {stats.volatilityChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                  {stats.volatilityChange >= 0 ? '+' : ''}{stats.volatilityChange}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {stats.volatilityChange >= 0 ? 'Increasing market volatility' : 'Decreasing market volatility'}
                {stats.volatilityChange >= 0 ? <IconTrendingUp className='size-4' /> :
                  <IconTrendingDown className='size-4' />}
              </div>
              <div className='text-muted-foreground'>
                Price stability assessment
              </div>
            </CardFooter>
          </Card>
        </div>

      </div>
    </PageContainer>
  );
}