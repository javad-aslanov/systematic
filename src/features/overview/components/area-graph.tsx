'use client';

import { IconAlertTriangle, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
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

// Generate realistic price data with different patterns based on risk profile
const generateCryptoData = () => {
  // Helper function to create stable growth pattern for low-risk coins
  const createStableGrowthPattern = (basePrice, volatility) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
    let currentPrice = basePrice;

    return months.map((month, index) => {
      // Generate gentle uptrend with natural fluctuations
      const direction = Math.random() > 0.3 ? 1 : -1; // 70% chance of going up
      const change = (Math.random() * volatility * 0.15) * direction;
      const trendFactor = 1 + (0.02 * (Math.random() * 0.5)); // Slight upward bias

      currentPrice = currentPrice * trendFactor * (1 + change);

      // Risk score for stable coins stays low with small variations
      const riskScore = Math.round(10 + (Math.random() * 8) - 4);

      return {
        month,
        price: Number(currentPrice.toFixed(basePrice < 1 ? 8 : 2)),
        riskScore: Math.max(5, Math.min(25, riskScore)) // Keep between 5-25
      };
    });
  };

  // Helper function to create a moderate volatility pattern for medium-risk coins
  const createVolatilePattern = (basePrice, volatility) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
    let currentPrice = basePrice;

    return months.map((month, index) => {
      // More volatile but without clear pump and dump
      const direction = Math.random() > 0.5 ? 1 : -1;
      const change = (Math.random() * volatility * 0.3) * direction;

      // Create a cycle pattern with more volatility
      const cycleFactor = Math.sin((index / months.length) * Math.PI * 2) * volatility * 0.2;
      currentPrice = currentPrice * (1 + change + cycleFactor);

      // Risk score fluctuates in medium range
      const riskScore = Math.round(30 + cycleFactor * 100 + (Math.random() * 12) - 6);

      return {
        month,
        price: Number(currentPrice.toFixed(basePrice < 1 ? 8 : 2)),
        riskScore: Math.max(25, Math.min(55, riskScore)) // Keep between 25-55
      };
    });
  };

  // Helper function to create a pump and dump pattern for high-risk coins
  const createPumpAndDumpPattern = (basePrice, volatility, pumpStart, pumpPeak, dumpStart, riskProfile) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];

    // Risk score patterns - higher volatility coins have steeper risk increases before dumps
    const generateRiskScore = (index, baseRisk, isPumpPhase, isDumpPhase, riskSeverity) => {
      let risk = baseRisk;

      // Risk increases slightly before pump, dramatically during pump, stays high during dump
      if (index >= pumpStart - 1 && index < pumpPeak) {
        // Risk accelerates before and during pump
        risk += (index - pumpStart + 1) * riskSeverity * 1.5;
      } else if (index >= pumpPeak && index <= dumpStart + 1) {
        // Risk peaks just before and during the initial dump
        risk = baseRisk + riskSeverity * 5;
      } else if (index > dumpStart + 1) {
        // Risk decreases but remains elevated after dump
        risk = baseRisk + riskSeverity * 3 - (index - dumpStart - 1) * riskSeverity * 0.5;
      }

      // Add some noise and clamp to 0-100 range
      risk += (Math.random() * riskSeverity * 0.6) - (riskSeverity * 0.3);
      return Math.max(Math.min(Math.round(risk), 100), 0);
    };

    return months.slice(0, 9).map((month, index) => {
      let priceMultiplier = 1;

      // Apply pump phase (exponential growth)
      if (index >= pumpStart && index < pumpPeak) {
        const pumpProgress = (index - pumpStart) / (pumpPeak - pumpStart);
        priceMultiplier = 1 + (Math.exp(pumpProgress * 2) - 1) * volatility * 2;
      }
      // Apply dump phase (sharp decline followed by smaller drops)
      else if (index >= dumpStart) {
        const dumpProgress = index - dumpStart;
        const severity = 0.3 + (volatility * 0.4);
        priceMultiplier = 1 + (volatility * 2) * (1 - severity) ** dumpProgress;
      }
      // Normal market fluctuations outside pump/dump
      else {
        priceMultiplier = 1 + (Math.random() * volatility * 0.4) - (volatility * 0.2);
      }

      // Add some noise to make it look realistic
      const noise = (Math.random() * 0.1) - 0.05;
      const price = basePrice * priceMultiplier * (1 + noise);

      // Generate corresponding risk score
      const isPumpPhase = index >= pumpStart && index < pumpPeak;
      const isDumpPhase = index >= dumpStart;
      const riskScore = generateRiskScore(index, riskProfile.baseRisk, isPumpPhase, isDumpPhase, riskProfile.riskSeverity);

      return {
        month,
        price: Number(price.toFixed(basePrice < 1 ? 8 : 2)),
        riskScore
      };
    });
  };

  return {
    btc: {
      name: 'Bitcoin (BTC)',
      color: '#f7931a',
      riskLevel: 'low',
      data: createStableGrowthPattern(42000, 0.15)
    },
    eth: {
      name: 'Ethereum (ETH)',
      color: '#627eea',
      riskLevel: 'low',
      data: createStableGrowthPattern(2500, 0.18)
    },
    sol: {
      name: 'Solana (SOL)',
      color: '#00FFA3',
      riskLevel: 'medium',
      data: createVolatilePattern(120, 0.25)
    },
    avax: {
      name: 'AVAX',
      color: '#E84142',
      riskLevel: 'medium',
      data: createVolatilePattern(35, 0.28)
    },
    pepe: {
      name: 'PEPE',
      color: '#26A17B',
      riskLevel: 'high',
      data: createPumpAndDumpPattern(0.0000254, 0.65, 1, 3, 4, { baseRisk: 65, riskSeverity: 8 })
    },
    moon: {
      name: 'MOON',
      color: '#FF4B4B',
      riskLevel: 'high',
      data: createPumpAndDumpPattern(0.00135, 0.85, 3, 5, 6, { baseRisk: 72, riskSeverity: 10 })
    },
    grok: {
      name: 'GrokCoin (GROK)',
      color: '#8A2BE2',
      riskLevel: 'high',
      data: createPumpAndDumpPattern(0.00074, 0.95, 2, 4, 5, { baseRisk: 78, riskSeverity: 12 })
    }
  };
};

// Create the crypto data with proper patterns based on risk level
const cryptoData = generateCryptoData();

export function AreaGraph() {
  const [selectedCoin, setSelectedCoin] = useState('btc');
  const [chartData, setChartData] = useState(cryptoData.btc.data);
  const [isClient, setIsClient] = useState(false);
  const [riskTrend, setRiskTrend] = useState({
    change: 0,
    increasing: false
  });

  // Update client-side rendering state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update chart data when coin selection changes
  useEffect(() => {
    if (!isClient) return;
    setChartData(cryptoData[selectedCoin].data);

    // Calculate risk trend (from first to last data point)
    const firstRisk = cryptoData[selectedCoin].data[0].riskScore;
    const lastRisk = cryptoData[selectedCoin].data[cryptoData[selectedCoin].data.length - 1].riskScore;
    const riskChange = lastRisk - firstRisk;

    setRiskTrend({
      change: Math.abs(riskChange),
      increasing: riskChange > 0
    });

  }, [selectedCoin, isClient]);

  // Chart configuration
  const chartConfig = {
    price: {
      label: 'Price (USD)'
    },
    riskScore: {
      label: 'Rug Pull Risk Score',
      color: 'red'
    }
  };

  // Risk level badge styling
  const getRiskBadgeClasses = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency with appropriate precision
  const formatCurrency = (value) => {
    if (value < 0.0001) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 8,
        maximumFractionDigits: 8
      }).format(value);
    }
    if (value < 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 6
      }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Risk score interpretation
  const getRiskDescription = (score) => {
    if (score < 20) return 'Very Low Risk';
    if (score < 40) return 'Low Risk';
    if (score < 60) return 'Moderate Risk';
    if (score < 80) return 'High Risk';
    return 'Extreme Risk';
  };

  const getLatestRiskScore = () => {
    return chartData[chartData.length - 1].riskScore;
  };

  // Find pump and dump regions - only for high risk coins
  const identifyPumpAndDumpRegions = () => {
    // Don't show pump and dump labels for low or medium risk coins
    if (cryptoData[selectedCoin].riskLevel !== 'high') {
      return { pumpRegion: null, dumpRegion: null };
    }

    if (chartData.length < 4) return { pumpRegion: null, dumpRegion: null };

    let maxPriceIndex = 0;
    let maxPrice = chartData[0].price;

    // Find peak price (end of pump)
    for (let i = 1; i < chartData.length; i++) {
      if (chartData[i].price > maxPrice) {
        maxPrice = chartData[i].price;
        maxPriceIndex = i;
      }
    }

    // Only consider it a pump if the price increased significantly
    const startPrice = chartData[0].price;
    const pumpPercentage = ((maxPrice - startPrice) / startPrice) * 100;

    // Only highlight regions if there was a significant pump (20%+) and dump (15%+)
    if (pumpPercentage >= 20 && maxPriceIndex < chartData.length - 1) {
      // Find start of dump (sharp decline after peak)
      let dumpStart = maxPriceIndex;
      const postPeakPrice = chartData[maxPriceIndex + 1].price;
      const dumpPercentage = ((maxPrice - postPeakPrice) / maxPrice) * 100;

      if (dumpPercentage >= 15) {
        return {
          pumpRegion: `${chartData[0].month} - ${chartData[maxPriceIndex].month}`,
          dumpRegion: `${chartData[maxPriceIndex].month} - ${chartData[chartData.length - 1].month}`
        };
      }
    }

    return { pumpRegion: null, dumpRegion: null };
  };

  const { pumpRegion, dumpRegion } = identifyPumpAndDumpRegions();

  // Generate market pattern description based on coin risk level
  const getMarketPatternDescription = () => {
    switch (cryptoData[selectedCoin].riskLevel) {
      case 'low':
        return {
          title: 'Stable Growth Pattern',
          description: 'Healthy price action with natural market cycles and low risk score'
        };
      case 'medium':
        return {
          title: 'Volatile Market Pattern',
          description: 'Higher volatility with inconsistent price action and moderate risk score'
        };
      case 'high':
        return pumpRegion ? {
          title: 'Pump and Dump Pattern Detected',
          description: 'Suspicious price action with rapid increase followed by sharp decline'
        } : {
          title: 'High Risk Pattern',
          description: 'Extremely volatile price action with elevated risk indicators'
        };
      default:
        return {
          title: '',
          description: ''
        };
    }
  };

  const marketPattern = getMarketPatternDescription();

  if (!isClient) {
    return null;
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Cryptocurrency Risk Analysis</CardTitle>
            <CardDescription>
              Price and rug pull likelihood over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-56 h-12">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cryptoData[selectedCoin].color }}></div>
                  <SelectValue>{cryptoData[selectedCoin].name}</SelectValue>
                  <Badge variant="outline" className={getRiskBadgeClasses(cryptoData[selectedCoin].riskLevel)}>
                    {cryptoData[selectedCoin].riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.keys(cryptoData).map((coin) => (
                  <SelectItem key={coin} value={coin} className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cryptoData[coin].color }}></div>
                      {cryptoData[coin].name}
                      <Badge variant="outline" className={getRiskBadgeClasses(cryptoData[coin].riskLevel)}>
                        {cryptoData[coin].riskLevel.toUpperCase()}
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
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={getRiskBadgeClasses(cryptoData[selectedCoin].riskLevel)}>
            {cryptoData[selectedCoin].riskLevel.toUpperCase()} RISK
          </Badge>
          <div className="text-sm text-muted-foreground">
            Current Risk Rating: <span className="font-medium">{getLatestRiskScore()}/100</span> - {getRiskDescription(getLatestRiskScore())}
          </div>
          {getLatestRiskScore() > 70 && (
            <span className="flex items-center text-red-500 text-sm font-medium">
              <IconAlertTriangle className="h-4 w-4 mr-1" /> High fraud potential
            </span>
          )}
        </div>



        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 10
            }}
          >
            <defs>
              <linearGradient id="fillRisk" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="rgba(239, 68, 68, 0.8)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="rgba(239, 68, 68, 0.2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={cryptoData[selectedCoin].color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={cryptoData[selectedCoin].color}
                  stopOpacity={0.1}
                />
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
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}`}
              label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', offset: -5 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 5%', 'dataMax + 5%']}
              tickFormatter={(value) => {
                if (value < 0.0001) return `$${value.toFixed(8)}`;
                if (value < 0.01) return `$${value.toFixed(6)}`;
                if (value < 1) return `$${value.toFixed(3)}`;
                if (value < 100) return `$${value.toFixed(2)}`;
                return `$${Math.round(value)}`;
              }}
              label={{ value: '', angle: 90, position: 'insideRight', offset: 5 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => {
                    if (name === 'price') return formatCurrency(value);
                    if (name === 'riskScore') return `${value} - ${getRiskDescription(value)}`;
                    return value;
                  }}
                />
              }
            />
            <Area
              yAxisId="left"
              dataKey="riskScore"
              type="monotone"
              fill="url(#fillRisk)"
              stroke="#ef4444"
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              dataKey="price"
              type="monotone"
              fill="url(#fillPrice)"
              stroke={cryptoData[selectedCoin].color}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col sm:flex-row items-start justify-between gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Risk trend: {riskTrend.increasing ? 'Increasing' : 'Decreasing'} by {riskTrend.change} points{' '}
              {riskTrend.increasing ?
                <IconTrendingUp className="h-4 w-4 text-red-500" /> :
                <IconTrendingDown className="h-4 w-4 text-green-500" />
              }
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Data from January - September 2024
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cryptoData[selectedCoin].color }}></div>
              <span>Price</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span>Rug Pull Risk</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}