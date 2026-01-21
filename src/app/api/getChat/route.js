'use server'
import { NextResponse } from 'next/server';
import { encrypt } from "../crypto.js";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req) {
  try {
    const { id } = await req.json();
    const getchattest = await pool.query(
      "SELECT * FROM public.conversations WHERE user_id = $1 ",
      [
        id
      ]
    );
    const raw = "error occured";
    if(getchattest.rows.length > 0){
      const raw = await getchattest.rows[0].content;
      return NextResponse.json({
        message: raw
      },{
        status: 200
      });
    }
    return NextResponse.json({
      message: raw
    },{
      status: 200
    });
  } catch (err) {
    console.log("The error is:", err);
    return NextResponse.json(
        { message: "Getting chat was unsuccesfully!" },
        { status: 400 }
    );
  }
}