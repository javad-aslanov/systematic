// src/app/api/chain-info/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Extract `chain` from the URL query, e.g. /api/chain-info?chain=eth
    const { searchParams } = new URL(request.url);
    const chain = searchParams.get('chain');

    let apiUrl: string;
    switch (chain) {
      case 'eth':
        apiUrl = 'https://api.blockcypher.com/v1/eth/main';
        break;
      case 'btc':
        apiUrl = 'https://api.blockcypher.com/v1/btc/main';
        break;
      case 'ltc':
        apiUrl = 'https://api.blockcypher.com/v1/ltc/main';
        break;
      case 'doge':
        apiUrl = 'https://api.blockcypher.com/v1/doge/main';
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported or missing `chain` query parameter' },
          { status: 400 }
        );
    }

    // Fetch the BlockCypher data on the server
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`BlockCypher returned status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Error in /api/chain-info:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
