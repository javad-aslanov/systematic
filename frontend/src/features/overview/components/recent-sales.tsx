"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { useState, useEffect } from 'react';

// Define the interface for coin data
interface CoinData {
  name: string;
  symbol: string;
  priceChange24h: string;
  volumeChange24h: string;
  socialMentions: number;
  riskScore: string;
  exchange: string;
  logoUrl: string;
}

// Base coin type with logoUrl for the static array
interface BaseCoin {
  name: string;
  symbol: string;
  logoUrl: string;
}

// Replace current data with these coins, adding logoUrl
const coins: BaseCoin[] = [
  { name: 'BRD', symbol: 'BRD', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2306.png' },
  { name: 'NEBL', symbol: 'NEBL', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1955.png' },
  { name: 'EDO', symbol: 'EDO', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2057.png' },
  { name: 'ICN', symbol: 'ICN', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/138.png' },
  { name: 'POLY', symbol: 'POLY', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/35148.png' },
  { name: 'PPT', symbol: 'PPT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1789.png' },
  { name: 'FUEL', symbol: 'FUEL', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/24087.png' },
  { name: 'SNM', symbol: 'SNM', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/9931.png' },
  { name: 'TNT', symbol: 'TNT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1923.png' },
  { name: 'GRS', symbol: 'GRS', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/258.png' },
  { name: 'BTS', symbol: 'BTS', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/463.png' },
  { name: 'VITE', symbol: 'VITE', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2937.png' },
  { name: 'GNT', symbol: 'GNT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/9533.png' },
  { name: 'MDA', symbol: 'MDA', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1954.png' },
  { name: 'REQ', symbol: 'REQ', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2071.png' },
  { name: 'STORJ', symbol: 'STORJ', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1772.png' },
  { name: 'OAX', symbol: 'OAX', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1853.png' },
  { name: 'CND', symbol: 'CND', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2043.png' },
  { name: 'VIBE', symbol: 'VIBE', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/35266.png' },
  { name: 'SNGLS', symbol: 'SNGLS', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1409.png' },
  { name: 'WINGS', symbol: 'WINGS', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1500.png' },
  { name: 'RDN', symbol: 'RDN', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2161.png' },
  { name: 'PIVX', symbol: 'PIVX', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1169.png' },
  { name: 'DLT', symbol: 'DLT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1949.png' },
  { name: 'HC', symbol: 'HC', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/330.png' },
  { name: 'ONG', symbol: 'ONG', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3217.png' },
  { name: 'EVX', symbol: 'EVX', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2034.png' },
  { name: 'YOYOW', symbol: 'YOYOW', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1899.png' },
  { name: 'VIB', symbol: 'VIB', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2019.png' },
  { name: 'DATA', symbol: 'DATA', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2143.png' },
  { name: 'GVT', symbol: 'GVT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2181.png' },
  { name: 'AST', symbol: 'AST', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2058.png' },
  { name: 'CHAT', symbol: 'CHAT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/24137.png' },
  { name: 'BNT', symbol: 'BNT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1727.png' },
  { name: 'IDEX', symbol: 'IDEX', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3928.png' },
  { name: 'VIA', symbol: 'VIA', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/29488.png' },
  { name: 'TNB', symbol: 'TNB', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2235.png' },
  { name: 'NAS', symbol: 'NAS', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1908.png' },
  { name: 'SNT', symbol: 'SNT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1759.png' },
  { name: 'ARDR', symbol: 'ARDR', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1320.png' },
  { name: 'DNT', symbol: 'DNT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1856.png' },
  { name: 'TCT', symbol: 'TCT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2364.png' },
  { name: 'RLC', symbol: 'RLC', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1637.png' },
  { name: 'MOD', symbol: 'MOD', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8494.png' },
  { name: 'STEEM', symbol: 'STEEM', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1230.png' },
  { name: 'NXS', symbol: 'NXS', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/789.png' },
  { name: 'WABI', symbol: 'WABI', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2267.png' },
  { name: 'DUSK', symbol: 'DUSK', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4092.png' },
  { name: 'SYS', symbol: 'SYS', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/541.png' },
  { name: 'POWR', symbol: 'POWR', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2132.png' },
  { name: 'ADX', symbol: 'ADX', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1768.png' },
  { name: 'LUN', symbol: 'LUN', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1658.png' },
  { name: 'AMB', symbol: 'AMB', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2081.png' },
  { name: 'WPR', symbol: 'WPR', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2511.png' },
  { name: 'POA', symbol: 'POA', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2548.png' },
  { name: 'CDT', symbol: 'CDT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/14489.png' },
  { name: 'NULS', symbol: 'NULS', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2092.png' },
  { name: 'STPT', symbol: 'STPT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4006.png' },
  { name: 'APPC', symbol: 'APPC', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2344.png' },
  { name: 'CLOAK', symbol: 'CLOAK', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/362.png' },
  { name: 'NAV', symbol: 'NAV', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/377.png' },
  { name: 'QLC', symbol: 'QLC', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2321.png' },
  { name: 'MITH', symbol: 'MITH', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2608.png' },
  { name: 'BCD', symbol: 'BCD', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2222.png' },
  { name: 'LRC', symbol: 'LRC', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1934.png' },
  { name: 'OST', symbol: 'OST', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2296.png' },
  { name: 'MTH', symbol: 'MTH', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1947.png' },
  { name: 'SUB', symbol: 'SUB', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1984.png' },
  { name: 'BLZ', symbol: 'BLZ', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2505.png' },
  { name: 'ELF', symbol: 'ELF', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2299.png' },
  { name: 'BCPT', symbol: 'BCPT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2061.png' },
  { name: 'RCN', symbol: 'RCN', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2096.png' },
  { name: 'INS', symbol: 'INS', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/29265.png' },
  { name: 'CVC', symbol: 'CVC', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1816.png' },
  { name: 'KMD', symbol: 'KMD', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1521.png' },
  { name: 'DGD', symbol: 'DGD', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/800.png' },
  { name: 'CTXC', symbol: 'CTXC', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2638.png' },
  { name: 'PNT', symbol: 'PNT', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5794.png' },
  { name: 'REN', symbol: 'REN', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2539.png' }
];


// Function to generate coin data with TypeScript types
function generateCoinData(coin: { name: string; symbol: string, logoUrl: string }): CoinData {
  const isPump = Math.random() < 0.05; // 5% chance of being in pump state
  const priceChange24h = isPump ? (20 + Math.random() * 80) : (-5 + Math.random() * 10);
  const volumeChange24h = isPump ? (200 + Math.random() * 800) : (0 + Math.random() * 50);
  const socialMentions = isPump ? (500 + Math.random() * 1500) : (0 + Math.random() * 100);
  const riskScore = isPump ? (80 + Math.random() * 20) : (0 + Math.random() * 20);

  return {
    ...coin,
    priceChange24h: priceChange24h.toFixed(2),
    volumeChange24h: volumeChange24h.toFixed(2),
    socialMentions: Math.floor(socialMentions),
    riskScore: riskScore.toFixed(2),
    exchange: ['Binance', 'Coinbase', 'Kraken'][Math.floor(Math.random() * 3)],
    logoUrl: coin.logoUrl
  };
}

// Function to determine risk color class with proper numeric parsing
function getRiskClass(score: string): string {
  const numScore = parseFloat(score);
  if (numScore > 70) return 'text-red-500';
  if (numScore > 30) return 'text-yellow-500';
  return 'text-green-500';
}

// Component with typed state and corrected key usage
export function RecentSales() {
  const [displayedCoins, setDisplayedCoins] = useState<CoinData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const allCoinData = coins.map(generateCoinData);
      const sortedCoins = allCoinData.sort((a, b) => parseFloat(b.riskScore) - parseFloat(a.riskScore));
      const topCoins = sortedCoins.slice(0, 7);
      setDisplayedCoins(topCoins);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Live Activity Feed</CardTitle>
        <CardDescription>Monitoring cryptocurrencies for suspicious activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {displayedCoins.map((coin) => (
            <div key={coin.symbol} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={coin.logoUrl} alt={coin.symbol} />
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>{coin.name}</p>
                <p className='text-muted-foreground text-sm'>{coin.name.length % 2 == 0 ? "Kraken" : "CMC"} | Price change: {coin.priceChange24h}%</p>
              </div>
              <div className={`ml-auto font-medium ${getRiskClass(coin.riskScore)}`}>
                Risk: {coin.riskScore}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}