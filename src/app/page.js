'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [ type, setType ] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameSign, setUsernameSign] = useState("");
  const [email, setEmail] = useState("");
  const [passwordSign, setPasswordSign] = useState("");

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernameSign,
        email,
        passwordSign
      }),
    });

    if(res.ok) {
      setType(true);
      const data = await res.json();
      alert(data['message']);
    } else {
      const data = await res.json();
      alert(data['message']);
    }
  }

  const changeType = () => {
    if(type == true)
      setType(false);
    else
      setType(true);
  }

  return (
    <section className="bg-black w-full h-screen content-center">
      <div className="w-full h-auto flex justify-center">
        <div className="w-auto sm:border border-solid border-white/[.145] sm:rounded-lg shadow-white sm:shadow-md/10 sm:px-10 sm:pt-30 sm:pb-10">
          <div className="w-full p-5 block h-auto block justify-inherit">
            <div className="flex justify-center sm:pt-5 pb-5">
        <Image src="/images/logo.png" alt="Imagine full screen" className="rounded-[5px] shadow-xl/30" width={50} height={50}/>
        <h1 className="text-[#1793d1] font-bold pt-2 pl-2 text-2xl font-monospace">Gethonis</h1>
      </div>

      {type ? (

            <form onSubmit={handleLogin}>
              <input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-8 rounded-lg shadow-white shadow-xs/10 border shadow-white border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-md sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-md focus:outline-none"
              />
              <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-5 rounded-lg shadow-white shadow-xs/10 border shadow-white border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-md sm:text-base h-10 p-2 px-5 mb-5 w-full mr-2 sm:text-md focus:outline-none"
              />
              <div className="flex justify-center">
                <button type="submit" className="w-full rounded-lg shadow-white shadow-md/10 mt-5 bg-gray-300 border text-black border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base h-10 px-10 sm:text-[15px]">
                  Login
                </button>
              </div>
            </form>

        ) : (<form onSubmit={handleSignUp}>
              <input 
                type="text"
                placeholder="Username"
                value={usernameSign}
                onChange={(e) => setUsernameSign(e.target.value)}
                className="mt-8 rounded-lg shadow-white shadow-xs/10 border shadow-white border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-md sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-md focus:outline-none"
              />
              <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-5 rounded-lg shadow-white shadow-xs/10 border shadow-white border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-md sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-md focus:outline-none"
              />
              <input 
                type="password"
                placeholder="Password"
                value={passwordSign}
                onChange={(e) => setPasswordSign(e.target.value)}
                className="mt-5 rounded-lg shadow-white shadow-xs/10 border shadow-white border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-md sm:text-base h-10 p-2 px-5 mb-5 w-full mr-2 sm:text-md focus:outline-none"
              />
              <div className="flex justify-center">
                <button type="submit" className="w-full rounded-lg shadow-white shadow-md/10 mt-5 bg-gray-300 border text-black border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base h-10 px-10 sm:text-[15px]">
                  Sign
                </button>
              </div>
            </form>)}
            <button className="text-red-200 p-2 w-70" onClick={changeType}>{type ? ("You don't have an account? register here") : ("You already posses an account? login here")}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
