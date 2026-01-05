'use server'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { redirect, RedirectType } from "next/navigation";
import { Dash } from './client.js';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

export default async function Gethonis() {
	const cookieStore = await cookies();
	const idCookie = cookieStore.get('idcookie')?.value;
	const usernameCookie = cookieStore.get("username")?.value;
	const tokenCookie = cookieStore.get("token")?.value;
	const verify = await pool.query(
		"SELECT token FROM public.users WHERE username = $1",
		[usernameCookie]
	);
	const ver = verify.rows[0];
	if(tokenCookie === ver.token) {
		return <Dash id={idCookie} username={usernameCookie} token={tokenCookie}/>;
	} else {
		redirect('/', RedirectType.push);
	}
	
}