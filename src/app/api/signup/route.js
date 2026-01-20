'use server'
import { NextResponse } from "next/server";
import { decrypt, encrypt } from '../crypto.js';
import { Pool } from "pg";


const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

export async function POST(req) {
	try {
		const {usernameSign, email, passwordSign} = await req.json();
		const Username = usernameSign;
		const encEmail = encrypt(email);
		const encPassword = encrypt(passwordSign);
		const check = await pool.query(
			"SELECT username FROM public.users WHERE username = $1",
			[
				Username,
			]
		);

		if(check.rows.length > 0) {
			return NextResponse.json(
			{ 
				error: "Invalid Creds",
				message: "Username already exists!",
			},	
			{
				status: 400
			});
		}
		const result = await pool.query(
			"INSERT INTO public.users (username, password, iv_password, email, iv_email) VALUES ($1, $2, $3, $4, $5)",
			[ 
				Username,
				encPassword.encryptedData,
				encPassword.iv,
				encEmail.encryptedData,
				encEmail.iv
			]
		);
		return NextResponse.json({
			message: "Succesfully registered!",
		});
	} catch (err) {
		console.error("API Error", err);
		return NextResponse.json({
			message: "The registration process could not be finished"
		});
	}
}