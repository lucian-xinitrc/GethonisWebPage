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
	try {
		const gethonisKey = process.env.GETHONIS_TOKEN;
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
			return <Dash id={idCookie} username={usernameCookie} token={tokenCookie} gethoniskey={gethonisKey}/>;
		} else {
			redirect('/', RedirectType.push);
		}
	} catch (err) {
		redirect('/', RedirectType.push);
	}
	
	
}