'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password
      }),
    });

    if(res.ok) {
      router.push("/gethonis");
    } else {
      alert("Invalid Login");
    }
  }


  return (
    <section className="bg-black w-full h-screen content-center">
      <div className="w-full h-auto flex justify-center">
        <div className="w-auto border border-solid border-white/[.145] rounded-xl  px-5 py-10 pt-30 pb-20">
          <div className="w-full p-5 block h-auto block justify-inherit">
            <h1 className="font-bold text-4xl text-center">Gethonis</h1>
            <form onSubmit={handleLogin}>
              <input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-8 rounded-2xl border shadow-white border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-[15px] focus:outline-none"
              />
              <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-5 rounded-2xl border shadow-white border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-[15px] focus:outline-none"
              />
              <div className="flex justify-center">
                <button type="submit" className="w-full rounded-2xl mt-5 bg-white border text-black border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base h-10 px-10 sm:text-[15px]">
                  Insert
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
