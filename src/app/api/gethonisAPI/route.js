'use server';

import { NextResponse } from 'next/server';
import { decrypt, encrypt } from '../crypto.js';
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
    const openai = await fetch('https://api.gethonis.com/api/openai', {
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

      const grok = await fetch('https://api.gethonis.com/api/grok', {
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
      
      const choice = 0;
      const openaitext = await openai.text();
      const groktext = await grok.text();
      const value = openaitext + " " + groktext;

      const newResponse = [
        ...messages,
        { role: "user", value}
      ];

      if(choice == 0) {
        const gethonis = await fetch('https://api.gethonis.com/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            headers: process.env.GETHONIS_TOKEN,
            messages: newResponse.slice(0, -1),
            stream: false
          }),
        });
        const data = await gethonis.text();
        return NextResponse.json({
          status: gethonis.status,
          message: data
        });
      } else {
        const gethonis = await fetch('https://api.gethonis.com/api/grok', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            headers: process.env.GETHONIS_TOKEN,
            messages: newResponse.slice(0, -1),
            stream: false
          }),
        });
        const data = await gethonis.text();
        return NextResponse.json({
          status: gethonis.status,
          message: data
        });
      }

      return NextResponse.json({
        status: grok.status,
        message: groktext
      });
      

  } catch (err) {
    console.error('RAW API Error:', err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
