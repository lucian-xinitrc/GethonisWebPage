'use server';

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const res = await fetch('https://api.gethonis.com/api/gethonis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headers: process.env.GETHONIS_TOKEN,
        messages,
        stream: false
      }),
    });

    const raw = await res.text();

    return NextResponse.json({
      status: res.status,
      message: raw
    });

  } catch (err) {
    console.error('RAW API Error:', err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
