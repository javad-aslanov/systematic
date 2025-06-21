'use client';

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

interface ChainInfo {
  name: string;
  height: number;
  hash: string;
  time: string;
  peer_count: number;
  unconfirmed_count: number;
  high_fee_per_kb?: number;
  medium_fee_per_kb?: number;
  low_fee_per_kb?: number;
  high_gas_price?: number;
  medium_gas_price?: number;
  low_gas_price?: number;
  base_fee?: number;
  last_fork_height?: number;
  last_fork_hash?: string;
}

export default function Infocards({
                                         pie_stats,
                                         bar_stats,
                                         area_stats
                                       }: {
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  // Initial stat values (unused now)
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

  useEffect(() => {
    // existing fluctuation logic (optional)
  }, []);

  // Coin list state
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        if (!res.ok) {
          // handle error
        }
        const data: Coin[] = await res.json();
        setCoins(data);
      } catch (error) {
        // console.error
      }
    };
    fetchCoins();
  }, []);

  const filteredCoins = coins.filter(
    coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Blockchain monitor setup
  const chainConfigs: Array<{ display: string }> = [
    { display: 'Ethereum' },
    { display: 'Bitcoin' },
    { display: 'Litecoin' },
    { display: 'Dogecoin' }
  ];

  const staticChainData: Record<string, ChainInfo> = {
    Ethereum: {
      name: 'Ethereum',
      height: 22612549,
      hash: 'e2952ae90b08abcd1234…',
      time: '2025-06-01T21:32:30Z',
      peer_count: 25,
      unconfirmed_count: 0,
      high_gas_price: 15728119101,
      medium_gas_price: 10913798643,
      low_gas_price: 5555239013,
      base_fee: 899258908,
      last_fork_height: 22607555,
      last_fork_hash: '256078d2919291daae10…'
    },
    Bitcoin: {
      name: 'Bitcoin',
      height: 899414,
      hash: '00000000000000000001df37abcd5678…',
      time: '2025-06-01T21:18:00Z',
      peer_count: 243,
      unconfirmed_count: 4500,
      high_fee_per_kb: 4031,
      medium_fee_per_kb: 2382,
      low_fee_per_kb: 2023,
      last_fork_height: 888946,
      last_fork_hash: '000000000000000000005f83abcd1234…'
    },
    Litecoin: {
      name: 'Litecoin',
      height: 3621456,
      hash: 'abcd1234abcd1234abcd1234abcd1234…',
      time: '2025-06-01T21:30:00Z',
      peer_count: 150,
      unconfirmed_count: 120,
      high_fee_per_kb: 75,
      medium_fee_per_kb: 50,
      low_fee_per_kb: 25,
      last_fork_height: 3600000,
      last_fork_hash: 'abcdabcdabcdabcdabcdabcdabcdabcd…'
    },
    Dogecoin: {
      name: 'Dogecoin',
      height: 4657896,
      hash: '1234abcd1234abcd1234abcd1234abcd…',
      time: '2025-06-01T21:35:45Z',
      peer_count: 85,
      unconfirmed_count: 350,
      high_fee_per_kb: 5,
      medium_fee_per_kb: 3,
      low_fee_per_kb: 1,
      last_fork_height: 4600000,
      last_fork_hash: 'abcd1234abcd1234abcd1234abcd1234…'
    }
  };

  const [chainData] = useState<Record<string, ChainInfo | null>>(
    chainConfigs.reduce((acc, cfg) => {
      acc[cfg.display] = staticChainData[cfg.display];
      return acc;
    }, {} as Record<string, ChainInfo | null>)
  );

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        {/* Header */}


        {/* Blockchain-Based Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {chainConfigs.map(cfg => {
            const info = chainData[cfg.display];
            if (!info) return null;

            // derive average fee/gas
            let avgFee: number;
            let unit: string;
            if (cfg.display === 'Ethereum') {
              const { high_gas_price = 0, medium_gas_price = 0, low_gas_price = 0 } = info;
              avgFee = (high_gas_price + medium_gas_price + low_gas_price) / 3 / 1e9;
              unit = 'Gwei';
            } else {
              const {
                high_fee_per_kb = 0,
                medium_fee_per_kb = 0,
                low_fee_per_kb = 0
              } = info;
              avgFee = (high_fee_per_kb + medium_fee_per_kb + low_fee_per_kb) / 3;
              unit = 'sat/kB';
            }

            return (
              <Card key={cfg.display} className="@container/card">
                <CardHeader>
                  <CardDescription>{cfg.display} Mempool</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {info.unconfirmed_count.toLocaleString()} tx
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      Avg fee: {avgFee.toFixed(unit === 'Gwei' ? 1 : 0)} {unit}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div>Block height: #{info.height.toLocaleString()}</div>
                  <div>Peers: {info.peer_count.toLocaleString()}</div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
