"use client";
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
import { EquityCurveGraph } from '@/features/overview/components/area-graph';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export default function OverViewLayout({
  pie_stats,
  bar_stats,
  area_stats
}: {
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  // Fetch stats and blockchain info from backend
  const [stats, setStats] = useState<any>(null);
  const [chainStats, setChainStats] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();
        setStats(data.stats);
        setChainStats(data.chains);
      } catch (error) {
        setStats(null);
        setChainStats([]);
      }
    }
    fetchDashboard();
  }, []);

  // State for coin list (CoinGecko)
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/coins');
        const data = await res.json();
        setCoins(Array.isArray(data) ? data : []);
      } catch (error) {
        setCoins([]);
      }
    };
    fetchCoins();
  }, []);
  

  const filteredCoins = Array.isArray(coins)
  ? coins.filter(
      coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  // Loading state
  if (!stats) return <div>Loading...</div>;

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Crypto Market Intelligence Dashboard
          </h2>
        </div>

        {/* Top Section: Charts + Coin Search + Blockchain Activity */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <EquityCurveGraph />
          </div>

          {/* Coin Search */}
          <div className="col-span-4 md:col-span-3">
            <h3 className="text-xl font-semibold mb-2">
              Search StableCoins (sorted by marketcap)
            </h3>
            <input
              type="text"
              placeholder="Search by name or symbol..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            {/* Table Container with Fixed Height and Scroll */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Table Header */}
              <table className="w-full bg-gray-100 dark:bg-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Symbol</th>
                    <th className="px-4 py-2 text-right">Price (USD)</th>
                    <th className="px-4 py-2 text-right">24h %</th>
                    <th className="px-4 py-2 text-right">Market Cap</th>
                  </tr>
                </thead>
              </table>

              {/* Scrollable Body */}
              <div className="max-h-[350px] overflow-y-auto">
                <table className="w-full">
                  <tbody>
                  {filteredCoins.map((coin, idx) => (
                    <tr
                      key={coin.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2 flex items-center space-x-2">
                        <img
                          src={coin.image}
                          alt={`${coin.name} logo`}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{coin.name}</span>
                      </td>
                      <td className="px-4 py-2 uppercase">{coin.symbol}</td>
                      <td className="px-4 py-2 text-right">
                        ${coin.current_price.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-2 text-right ${
                          coin.price_change_percentage_24h >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </td>
                      <td className="px-4 py-2 text-right">
                        ${coin.market_cap.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {filteredCoins.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No coins match your search.
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 24h Transactions Chart */}
          <div className="col-span-4">{bar_stats}</div>

          {/* Blockchain Activity Monitor */}
          <div className="col-span-4 md:col-span-3">
            <h3 className="text-xl font-semibold mb-2">
              Blockchain Activity Monitor
            </h3>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full bg-gray-100 dark:bg-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Chain</th>
                    <th className="px-4 py-2 text-right">Height</th>
                    <th className="px-4 py-2 text-left">Hash (truncated)</th>
                    <th className="px-4 py-2 text-left">Time (UTC)</th>
                    <th className="px-4 py-2 text-right">Peers</th>
                    <th className="px-4 py-2 text-right">Unconfirmed</th>
                  </tr>
                </thead>
              </table>
              <div className="max-h-[350px] overflow-y-auto">
                <table className="w-full">
                  <tbody>
                  {chainStats.map(chain => (
                    <tr
                      key={chain.name}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-2">{chain.name}</td>
                      <td className="px-4 py-2 text-right">
                        {chain.height ? `#${chain.height}` : '—'}
                      </td>
                      <td className="px-4 py-2">
                        {chain.hash ? `${chain.hash.slice(0, 12)}…` : '—'}
                      </td>
                      <td className="px-4 py-2">
                        {chain.time
                          ? new Date(chain.time)
                              .toISOString()
                              .replace('T', ' ')
                              .replace('Z', '')
                          : '—'}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {chain.peer_count ?? '—'}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {chain.unconfirmed_count ?? '—'}
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
          {/* Total Exposure Value */}
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Exposure Value</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                ${stats.totalValue.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {stats.totalValueChange >= 0 ? (
                    <IconTrendingUp />
                  ) : (
                    <IconTrendingDown />
                  )}
                  {stats.totalValueChange >= 0 ? '+' : ''}
                  {stats.totalValueChange}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stats.totalValueChange >= 0
                  ? 'Bullish trend this week'
                  : 'Bearish trend this week'}
                {stats.totalValueChange >= 0 ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">
                Market cap analysis for top tokens
              </div>
            </CardFooter>
          </Card>

          {/* Active Traders */}
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Active Traders</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.activeTraders.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {stats.activeTradersChange >= 0 ? (
                    <IconTrendingUp />
                  ) : (
                    <IconTrendingDown />
                  )}
                  {stats.activeTradersChange >= 0 ? '+' : ''}
                  {stats.activeTradersChange}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stats.activeTradersChange >= 0
                  ? 'Growing trader activity'
                  : 'Decreasing trader activity'}
                {stats.activeTradersChange >= 0 ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">
                Exchange participation metrics
              </div>
            </CardFooter>
          </Card>

          {/* 24h Transactions */}
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>24h Transactions</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.transactions.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {stats.transactionsChange >= 0 ? (
                    <IconTrendingUp />
                  ) : (
                    <IconTrendingDown />
                  )}
                  {stats.transactionsChange >= 0 ? '+' : ''}
                  {stats.transactionsChange}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stats.transactionsChange >= 0
                  ? 'High network activity'
                  : 'Slowing network activity'}
                {stats.transactionsChange >= 0 ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">
                Blockchain throughput analysis
              </div>
            </CardFooter>
          </Card>

          {/* Volatility Index */}
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Volatility Index</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.volatilityIndex}%
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {stats.volatilityChange >= 0 ? (
                    <IconTrendingUp />
                  ) : (
                    <IconTrendingDown />
                  )}
                  {stats.volatilityChange >= 0 ? '+' : ''}
                  {stats.volatilityChange}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stats.volatilityChange >= 0
                  ? 'Increasing market volatility'
                  : 'Decreasing market volatility'}
                {stats.volatilityChange >= 0 ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">
                Price stability assessment
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
