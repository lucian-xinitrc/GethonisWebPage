'use server';

import { NextResponse } from 'next/server';
import { decrypt, encrypt } from '../crypto.js';
import { encryptMsg } from '../cryptoMsg.js';
import { Pool } from "pg";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req) {
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  try {
    const {messages} = await req.json();
    const gethonis = await fetch('https://api.gethonis.com/api/gethonis', {
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

      const text = await gethonis.text();
      
      return NextResponse.json(
      { message: text},
      )
  } catch (err) {
    console.error('RAW API Error:', err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
