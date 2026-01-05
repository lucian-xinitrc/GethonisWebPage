'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { FaPaperPlane, FaPaperclip, FaLock } from 'react-icons/fa';
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Dash = ({ id, username, token}) => {
  	const chatContainerRef = useRef(null);
  	const [chat, setChat] = useState([]);
  	const [message, setMessage] = useState("");
  	const [init, setInit] = useState(false);


	const handleGettingMessage = async () => {
	  setInit(true);
	  if (!message.trim()) return;

	  const placeholder = { role: "assistant", content: "Please wait..." };

	  const updatedChat = [
	    ...chat,
	    { role: "user", content: message },
	    placeholder
	  ];
	  setChat(updatedChat);
	  setMessage("");

	  const res = await fetch("/api/gethonisAPI", {
	    method: "POST",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify({
	      messages: updatedChat.slice(0, -1)
	    }),
	  });

	  let data = await res.json();

	  let botMessage = data.message;
	  if (typeof botMessage === "string" && botMessage.startsWith("[")) {
	    try {
	      const parsed = JSON.parse(botMessage);
	      if (Array.isArray(parsed)) botMessage = parsed.join("");
	    } catch {}
	  }

	  setChat(prev =>
	    prev.map(msg =>
	      msg === placeholder ? { ...msg, content: botMessage } : msg
	    )
	  );
	};

	useEffect(() => {
	  if (chatContainerRef.current) {
	    chatContainerRef.current.scrollTo({
	      top: chatContainerRef.current.scrollHeight,
	      behavior: "smooth",
	    });
	  }
	}, [chat]);
	return (
		<section className="bg-black w-screen h-[100dvh] overflow-hidden content-center no-scrollbar">
			<div className="flex justify-center bg-transparent">
				<Image src="/images/logo.png" alt="Imagine full screen" className="rounded-[5px] shadow-xl/30" width={50} height={50}/>
				<h1 className="text-[#1793d1] font-bold pt-2 pl-2 text-3xl font-monospace">Gethonis</h1>
				

			</div>
			<div className="flex justify-center bg-transparent pt-10">
			{init === false ? (<h3 className="font-bold text-gray-500 sm:w-auto break-words whitespace-pre-wrap max-w-xs text-center">Welcome to Gethonis, the perfect squad!</h3>) : ("") }
			</div>
			<div className="w-full sm:pt-10 flex justify-center">
				<div className="w-full sm:w-3xl h-auto p-2 sm:p-5 rounded-lg ">
					<div ref={chatContainerRef} className={` ${init === false ? "hidden" : "block"} w-full h-[500px] sm:h-[700px] p-5 sm:p-10 overflow-scroll rounded-lg no-scrollbar`}>
						{chat.map((c, i) => (
						  <div
						    key={i}
						    className={`flex ${c.role === "user" ? "justify-end" : "justify-start"} mb-5`}
						  >	
						  <div>
						  <b className={`flex ${c.role === "user" ? "justify-end" : "justify-start"} mb-2`}>{c.role === "user" ? (<span className="bg-neutral-primary-soft border border-default text-heading text-sm font-medium px-1.5 py-0.5 rounded">{username}</span>) : (<span className="bg-neutral-primary-soft border border-solid text-heading text-sm font-medium px-1.5 py-0.5 rounded">Gethonis</span>)}</b>
						    <div
						      className={`p-2 rounded-lg max-w-xs  break-words whitespace-pre-wrap sm:max-w-xl no-scrollbar ${
						        c.role === "user" ? "transition-colors border border-solid border-white/[.145] items-center justify-center transition duration-700 ease-in-out font-bold text-md sm:text-base h-auto p-2 px-5 w-full overflow-scroll text-md focus:outline-none" : "transition-colors transition duration-700 ease-in-out font-bold text-md sm:text-base h-auto p-2 px-5 w-full mr-2 sm:text-md focus:outline-none"
						      }`}
						    >
						    
						    <ReactMarkdown
							  remarkPlugins={[remarkGfm]}
							  components={{
							    code({node, inline, className, children, ...props}) {
							      return !inline ? (
							        <pre
							          className="max-h-700 overflow-y-auto no-scrollbar bg-slate-900 text-white rounded-md p-5 my-5 text-md"
							          {...props}
							        >
							          <code className={className}>
							            {children}
							          </code>
							        </pre>
							      ) : (
							        <code className={`bg-gray-200 px-1 rounded`} {...props}>
							          {children}
							        </code>
							      );
							    }
							  }}
							>
							  {c.content}
							</ReactMarkdown>

						    </div>
						  </div>
						 </div>
						))}
					</div>
						      <form onSubmit={(e) => { 
					  e.preventDefault();
					  handleGettingMessage(); 
					}}>
					<div className="w-full absolute bottom-0 left-0 sm:relative flex justify-center">
					<div className="w-full flex justify-center w-auto m-5 mt-5 p-2 border border-solid border-white/[.145] shadow-white shadow-md/10 rounded-lg">
						
						<button className="hidden rounded-full w-12 h-10 overflow-hidden border text-white border border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaLock size={15} />
			            </button>
						<input type="text"
			              placeholder="Ask me anythig!"
			              value={message}
			              onChange={e => setMessage(e.target.value)}
			              type="text"
			              aria-describedby="helper-text-explanation" 
			              className="transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-md sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-[15px] focus:outline-none"/>
			            <button className="hidden rounded-full w-12 h-10 overflow-hidden border text-white border border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaPaperclip size={15} />
			            </button>
			            <button type="submit"  className="rounded-md ml-2 w-12 h-10 overflow-hidden border text-white border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaPaperPlane size={15} />
			            </button>
						      
					</div>
					</div>
				</form>
				</div>

			</div>
		</section>
	);
}

export { Dash };