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
   const { id, conversation } = await req.json();

let fixedConversation = [];

if (Array.isArray(conversation)) {
  fixedConversation = conversation.map((item) => {
    if (typeof item === "string") {
      try {
        return JSON.parse(item);
      } catch {
        return null;
      }
    }
    return item;
  }).filter(Boolean);
}

const encrypted = encrypt(JSON.stringify(fixedConversation));

const check = await pool.query(
  "SELECT content FROM public.conversations WHERE user_id = $1",
  [id]
);

if (check.rows.length > 0) {
  await pool.query(
    "UPDATE public.conversations SET content = $1 WHERE user_id = $2",
    [encrypted, id]
  );
} else {
  await pool.query(
    "INSERT INTO public.conversations (user_id, content) VALUES ($1, $2)",
    [id, encrypted]
  );
}

return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error('RAW API Error:', err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }

}