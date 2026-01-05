'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { FaPaperPlane, FaPaperclip, FaLock } from 'react-icons/fa';

const Dash = ({ id, username, token}) => {
	const [commando, setCommando] = useState("");
  	const [gethonisMessage, setGethonisMessage] = useState({});
  	const [userMessage, setUserMessage] = useState({});
  	const [linesGeth, setLinesGeth] = useState([]); 
  	const [lines, setLines] = useState([]); 
  	const logEndRef = useRef(null);
  	const [chat, setChat] = useState([]);
  	const [message, setMessage] = useState("");


	const handleGettingMessage = async () => {
	  if (!message.trim()) return;

	  const updatedChat = [
	    ...chat,
	    { role: "user", content: message }
	  ];

	  setChat(updatedChat);
	  setMessage("");

	  const res = await fetch("/api/gethonisAPI", {
	    method: "POST",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify({
	      messages: updatedChat
	    }),
	  });

	  const data = await res.json();

	  if (data.message) {
	    let botMessage = data.message;

	    // dacă API trimite array ca string, transformă-l în text curat
	    if (typeof botMessage === "string" && botMessage.startsWith("[")) {
	      try {
	        const parsed = JSON.parse(botMessage);
	        if (Array.isArray(parsed)) {
	          botMessage = parsed.join("");
	        }
	      } catch {}
	    }

	    setChat(prev => [
	      ...prev,
	      { role: "assistant", content: botMessage }
	    ]);
	  }
	};

	useEffect(() => {
	    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
	  }, [chat]);
	return (
		<section className="bg-black h-screen content-center">
			<div className="w-full p-10 flex justify-center">
				<div className="w-3xl h-auto p-5 rounded-lg">
					<div className="w-full h-[500px] p-10 overflow-scroll rounded-lg no-scrollbar">
						{chat.map((c, i) => (
						  <div
						    key={i}
						    className={`flex ${c.role === "user" ? "justify-end" : "justify-start"} mb-2`}
						  >	
						  <div>
						  <b className={`flex ${c.role === "user" ? "justify-end" : "justify-start"} mb-2`}>{c.role === "user" ? (<span class="bg-neutral-primary-soft border border-default text-heading text-xs font-medium px-1.5 py-0.5 rounded">{username}</span>) : (<span class="bg-neutral-primary-soft border border-default text-heading text-xs font-medium px-1.5 py-0.5 rounded">Gethonis</span>)}</b>
						    <div
						      className={`p-2 rounded-lg max-w-xs ${
						        c.role === "user" ? "transition-colors border border-solid border-white/[.145] flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-[15px] focus:outline-none" : "transition-colors border border-solid border-white/[.145] flex transition duration-700 ease-in-out font-bold text-sm sm:text-base h-auto p-2 px-5 w-full mr-2 sm:text-[15px] focus:outline-none"
						      }`}
						    >
						       {c.content}
						    </div>
						  </div>
						      </div>
						))}
					</div>
						      <form onSubmit={(e) => { 
  e.preventDefault();
  handleGettingMessage(); 
}}>
					<div className="w-full mt-5 p-2 border border-solid border-white/[.145] rounded-lg flex justify-center">
						
						<button className="hidden rounded-full w-12 h-10 overflow-hidden border text-white border border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaLock size={15} />
			            </button>
						<input type="text"
			              placeholder="Ask me anythig!"
			              value={message}
			              onChange={e => setMessage(e.target.value)}
			              type="text"
			              aria-describedby="helper-text-explanation" 
			              className="transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-[15px] focus:outline-none"/>
			            <button className="hidden rounded-full w-12 h-10 overflow-hidden border text-white border border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaPaperclip size={15} />
			            </button>
			            <button type="submit"  className="rounded-md ml-2 w-12 h-10 overflow-hidden border text-white border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaPaperPlane size={15} />
			            </button>
						      
					</div>
						      </form>
				</div>
			</div>
		</section>
	);
}

export { Dash };