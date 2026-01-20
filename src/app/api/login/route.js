'use server' 
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { decrypt, encrypt } from '../crypto.js';
import { Pool } from 'pg';


const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

export async function POST(req) {
	try {
		const {username, password} = await req.json();
		if(username && password) {
			const result = await pool.query(
				"SELECT id, username, password, iv_password FROM public.users WHERE username = $1",
				[username]
			);

			const rows = result.rows.map(row => ({
				username: row.username, 
				password: decrypt(row.password, row.iv_password)
			}));

			const user = result.rows[0];
			const passwordData = decrypt(user.password, user.iv_password)

			if(password === passwordData) {
				const token = encrypt(result.rows[0].username);

				const tokenAdd = await pool.query(
					"UPDATE public.users SET token = $1 WHERE username = $2",
					[ 
						token.encryptedData,
						result.rows[0].username
					]
				);


				const response = NextResponse.json(
		        { succes: true },
		        { status: 200 }
		      );

		      response.cookies.set("token", token.encryptedData, {
		        httpOnly: true,
		        path: "/",
		        maxAge: 60 * 60 * 24,
		        secure: process.env.NODE_ENV === "production",
		        sameSite: "lax",
		      });

		      response.cookies.set("idcookie", String(user.id), {
		        httpOnly: true,
		        path: "/",
		        maxAge: 60 * 60 * 24,
		        secure: process.env.NODE_ENV === "production",
		        sameSite: "lax",
		      });

		      response.cookies.set("username", user.username, {
		        httpOnly: true,
		        path: "/",
		        maxAge: 60 * 60 * 24,
		        secure: process.env.NODE_ENV === "production",
		        sameSite: "lax",
		      });

		      return response;
			} 
			return NextResponse.json({ error: "Invalid Creds"}, { status:401 });
		}

		return NextResponse.json({ error: "Invalid Creds"}, { status:401 });
	} catch (err) {
		console.error("API Error", err);
		return NextResponse.json({
			//message: "API Error"
		})
	}
}