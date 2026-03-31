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
    if(username && password){
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
    } else {
      setUsername("");
      setPassword("");
      alert("Fields cannot be empty!");
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    if(usernameSign && email && passwordSign){
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
    } else {
      setUsernameSign("");
      setEmail("");
      setPasswordSign("");
      alert("Fields cannot be empty!");
    }
  }

  const changeType = () => {
    if(type == true)
      setType(false);
    else
      setType(true);
  }

  return (
    <section className="bg-black-600 w-full h-screen content-center">
      <div className="w-full h-auto flex justify-center">
        <div className="w-auto sm:w-full lg:w-auto sm:rounded-lg shadow-gray sm:shadow-sm/10 sm:px-10 sm:pt-30 sm:pb-10">
          <div className="w-full p-5 block h-auto block justify-inherit">
            <div className="flex justify-center sm:pt-5 pb-5">
        <Image src="/images/logo.png" alt="Imagine full screen" className="rounded-[5px]" width={50} height={50}/>
        <h1 className="text-[#1793d1] font-bold pt-2 pl-2 text-2xl font-monospace">Gethonis</h1>
      </div>

      {type ? (

            <form onSubmit={handleLogin}>
              <input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-8 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base sm:h-auto lg:h-10 p-2 px-5 w-full mr-2 sm:text-lg lg:text-sm focus:outline-none text-white"
              />
              <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-5 rounded-lg border shadow-white border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base sm:h-auto lg:h-10 p-2 px-5 mb-5 w-full mr-2 sm:text-lg lg:text-sm focus:outline-none text-white"
              />
              <div className="flex justify-center">
                <button type="submit" className="w-full rounded-lg shadow-white shadow-md/10 mt-5 bg-gray-300 border text-black border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 font-bold sm:text-lg lg:text-sm h-10 sm:h-12 lg:h-10 px-10 ">
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
                className="mt-8 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base sm:h-auto lg:h-10 p-2 px-5 w-full mr-2 sm:text-lg lg:text-sm focus:outline-none text-white"
              />
              <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-8 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base sm:h-auto lg:h-10 p-2 px-5 w-full mr-2 sm:text-lg lg:text-sm focus:outline-none text-white"
              />
              <input 
                type="password"
                placeholder="Password"
                value={passwordSign}
                onChange={(e) => setPasswordSign(e.target.value)}
                className="mt-8 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base sm:h-auto lg:h-10 p-2 px-5 w-full mr-2 sm:text-lg lg:text-sm focus:outline-none text-white"
              />
              <div className="flex justify-center">
                <button type="submit" className="w-full rounded-lg shadow-white shadow-md/10 mt-5 bg-gray-300 border text-black border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 font-bold sm:text-lg lg:text-sm h-10 sm:h-12 lg:h-10 px-10 ">
                  Sign
                </button>
              </div>
            </form>)}
            <div className="w-full flex justify-center">
              <button className="text-[14px] text-red-200 p-2 mt-5 sm:text-md lg:text-sm w-70 text-center" onClick={changeType}>{type ? ("You don't have an account? register here") : ("You already posses an account? login here")}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
