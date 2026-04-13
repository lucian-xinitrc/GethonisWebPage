'use server'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { redirect, RedirectType } from "next/navigation";
import { Dash } from './client.js';
import { decrypt, encrypt } from './crypto.js';

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
			const getChat = await pool.query(
  "SELECT content FROM public.conversations WHERE user_id = $1",
  [idCookie]
);

const raw = getChat.rows[0]?.content;

// 🔴 CASE 1: no row at all
if (!raw) {
  return (
    <Dash
      id={idCookie}
      username={usernameCookie}
      token={tokenCookie}
      gethoniskey={gethonisKey}
      chatFromDb={[]}
    />
  );
}

// 🔴 CASE 2: jsonb vs string safety
let data = raw;

if (typeof data === "string") {
  try {
    data = JSON.parse(data);
  } catch {
    return (
      <Dash {...props} chatFromDb={[]} />
    );
  }
}

// 🔴 CASE 3: empty object in DB (FOARTE IMPORTANT)
if (
  !data ||
  Object.keys(data).length === 0 ||
  !data.iv ||
  !data.encryptedData
) {
  return (
    <Dash
      id={idCookie}
      username={usernameCookie}
      token={tokenCookie}
      gethoniskey={gethonisKey}
      chatFromDb={[]}
    />
  );
}

// 🔥 decrypt
let decrypted;

try {
  decrypted = decrypt(data.encryptedData, data.iv);
} catch (e) {
  console.error("DECRYPT ERROR:", e);
  return (
    <Dash {...props} chatFromDb={[]} />
  );
}

// 🔥 parse chat
let chatFromDb = [];

try {
  const parsed = JSON.parse(decrypted);
  chatFromDb = Array.isArray(parsed) ? parsed : [];
} catch {
  chatFromDb = [];
}

return (
  <Dash
    id={idCookie}
    username={usernameCookie}
    token={tokenCookie}
    gethoniskey={gethonisKey}
    chatFromDb={chatFromDb}
  />
);
		} else {
			redirect('/', RedirectType.push);
		}
	} catch (err) {
		redirect('/', RedirectType.push);
	}
	
	
}