'use server';

import { NextResponse } from 'next/server';
import { decrypt, encrypt } from '../crypto.js';
import { Pool } from "pg";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req) {
  try {
    const { id, messages } = await req.json();
    const check = await pool.query(
        "SELECT content FROM public.conversations WHERE user_id = $1",
        [
          id,
        ]
      );

    if(check.rows.length > 0) {
      const into = await pool.query(
        "UPDATE public.conversations SET content = $1 WHERE user_id = $2",
        [
          messages,
          id
        ]
      );
    } else {
      const into = await pool.query(
        "INSERT INTO public.conversations (user_id, content) VALUES ($1, $2)",
        [
          id,
          messages,
        ]
      );
    }
    return NextResponse.json({
      status: 200,
    });
  } catch (err) {
    console.error('RAW API Error:', err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }

}