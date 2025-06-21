'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export const description = 'Crypto market-wide metrics as a bar chart';

// toggle this to enable dynamic fetching
const isDynamic = false;

// some placeholder historical data for static mode
const STATIC_DATA = [
  { timestamp: '2025-06-21T15:00:00Z', marketCapChange: 2.5, fearGreed: 45 },
  { timestamp: '2025-06-21T16:00:00Z', marketCapChange: -1.2, fearGreed: 50 },
  { timestamp: '2025-06-21T17:00:00Z', marketCapChange: 0.8, fearGreed: 48 },
  { timestamp: '2025-06-21T18:00:00Z', marketCapChange: 1.1, fearGreed: 52 },
  { timestamp: '2025-06-21T19:00:00Z', marketCapChange: -0.4, fearGreed: 47 },
];

export function BarGraph() {
  // for static mode
  const [data, setData] = React.useState(STATIC_DATA);

  // for dynamic mode: just latest values
  const [dynamicValues, setDynamicValues] = React.useState({
    marketCapChange: 0,
    fearGreed: 0
  });

  React.useEffect(() => {
    if (!isDynamic) return;

    async function fetchMetrics() {
      try {
        // 1) Global market data
        const geo = await fetch('https://api.coingecko.com/api/v3/global');
        const {
          data: { market_cap_change_percentage_24h_usd: mcChange }
        } = await geo.json() as any;

        // 2) Fear & Greed Index
        const fngRes = await fetch('https://api.alternative.me/fng/?limit=1');
        const {
          data: [{ value: fgValue }]
        } = await fngRes.json() as any;
        const fg = Number(fgValue);

        setDynamicValues({
          marketCapChange: mcChange,
          fearGreed: fg
        });
      } catch (e) {
        console.error('Failed to fetch metrics', e);
      }
    }

    // initial fetch
    fetchMetrics();
    // and update every minute
    const id = setInterval(fetchMetrics, 60_000);
    return () => clearInterval(id);
  }, []);

  // choose what to render
  const chartData = isDynamic
    ? [{ name: 'Now', ...dynamicValues }]
    : data;

  return (
    <Card className="@container/card !pt-3">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-b">
        <div>
          <CardTitle>Market Metrics (Bar)</CardTitle>
          <CardDescription className="text-sm">
              24h MC % change & Fear & Greed
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={isDynamic ? 'name' : 'timestamp'}
            tickFormatter={val =>
              isDynamic
                ? String(val)
                : new Date(String(val)).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })
            }
            interval={0}
            angle={isDynamic ? 0 : -45}
            textAnchor={isDynamic ? 'middle' : 'end'}
            height={isDynamic ? 30 : 60}
          />
          <YAxis />
          <Tooltip
            labelFormatter={val =>
              isDynamic
                ? String(val)
                : new Date(String(val)).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })
            }
          />
          <Legend verticalAlign="top" height={36} />
          <Bar
            dataKey="marketCapChange"
            name="24h MC Change %"
            fill="var(--primary)"
          />
          <Bar
            dataKey="fearGreed"
            name="Fear & Greed Index"
            fill="var(--muted-foreground)"
          />
        </BarChart>
      </CardContent>
    </Card>
  );
}
