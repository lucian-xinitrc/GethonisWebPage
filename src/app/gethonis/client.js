'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { FaPaperPlane, FaPaperclip, FaLock } from 'react-icons/fa';
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Dash = ({ id, username, token, gethoniskey}) => {
  	const chatContainerRef = useRef(null);
  	const [chat, setChat] = useState([]);
  	const [message, setMessage] = useState("");
  	const [init, setInit] = useState(false);

  	const endRef = useRef(null);

	  useEffect(() => {
	    endRef.current?.scrollIntoView({
	      behavior: "smooth",
	      block: "end",
	    });
	  }, [chat]);
	const handleGettingMessage = async () => {
		setInit(true);
	  	if (!message.trim()) return;

	  	const placeholder = { role: "assistant", content: "Thinking..." };

	  	const updatedChat = [
	    	...chat,
	    	{ role: "user", content: message },
	    	placeholder
	  	];
	  	setChat(updatedChat);
	  	setMessage("");

	    /*

		    const res = await fetch('https://api.gethonis.com/api/gethonis', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		      },
		      body: JSON.stringify({
		        headers: gethoniskey,
		        messages: updatedChat.slice(0, -1),
		        stream: true
		      }),
		    });

	    */

	    const result = await fetch("/api/gethonisAPI", {
	    	method: "POST",
	    	headers: { "Content-Type": "application/json" },
	    	body: JSON.stringify({
	      		messages: updatedChat.slice(0, -1),
	    	}),
	  	}); 
  		
	    const raw = await result.json();
	    const data = raw.message;
	  	let botMessage = data;
	  	if (typeof botMessage === "string" && botMessage.startsWith("[")) {
	    	try {
	      		const parsed = JSON.parse(botMessage);
	      		if (Array.isArray(parsed)) 
	      			botMessage = parsed.join("");
	    	} catch {}
	  	}

	  	setChat(prev =>
	    	prev.map(msg =>
	      		msg === placeholder ? { ...msg, content: botMessage } : msg
	    	)
	  	);

	  	/* 
	  	const result = await fetch("/api/saveChat", {
	    	method: "POST",
	    	headers: { "Content-Type": "application/json" },
	    	body: JSON.stringify({
	      		id,
	      		messages: chat
	    	}),
	  	}); 
	  	*/
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
		<>
		<div className={` ${init === false ? "h-screen" : "h-auto"} bg-black w-auto overflow-hidden content-center no-scrollbar`}>
			<div className={` ${init === false ? "" : "align-center fixed absolute"} w-full flex justify-center bg-black pt-3 pb-3 shadow-black shadow-lg/30`}>
				<Image src="/images/logo.png" alt="Imagine full screen" className="rounded-[5px] shadow-xl/30" width={50} height={50}/>
				<h1 className="text-[#1793d1] font-bold pt-2 pl-2 text-3xl font-monospace">Gethonis</h1>
					

			</div>
		<div className="flex justify-center bg-transparent pt-5">
				{init === false ? (<h3 className="font-bold text-gray-500 sm:w-auto break-words whitespace-pre-wrap max-w-xs text-center">Welcome to Gethonis, the perfect squad!</h3>) : ("") }
				</div>
		<div className={` ${init === false ? "" : "bottom-0 fixed mb-10"} w-full absolute left-0 flex justify-center`}>

			<form onSubmit={(e) => { 
					  e.preventDefault();
					  handleGettingMessage(); 
					}}>
					
					<div className="sm:w-[700px] bg-black flex justify-center mt-5 p-2 border border-solid border-white/[.145] ransition duration-700 ease-in-out hover:shadow-white/[.145] shadow-lg/30 rounded-full">
						
						<button className="hidden rounded-full w-12 h-10 overflow-hidden border text-white border border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaLock size={15} />
			            </button>
						<input type="text"
			              placeholder="Ask me anything!"
			              value={message}
			              onChange={e => setMessage(e.target.value)}
			              type="text"
			              aria-describedby="helper-text-explanation" 
			              className="transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-sm focus:outline-none"/>
			            <button className="hidden rounded-full w-12 h-10 overflow-hidden border text-white border border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[14px]">
			              <FaPaperclip size={15} />
			            </button>
			            <button type="submit"  className="rounded-full ml-2 w-20 h-10 overflow-hidden border text-white border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaPaperPlane size={15} />
			            </button>
						      
					
					</div>
				</form>
				</div>
				<div ref={chatContainerRef} className={` ${init === false ? "hidden" : "block"} mt-[20%] sm:mt-[10%] p-5 sm:mx-[30%] sm:p-10 overflow-scroll rounded-lg no-scrollbar`}>
					{chat.map((c, i) => (
						<div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"} mb-5`}>	
						  <div>
						  <b className={`flex ${c.role === "user" ? "justify-end" : "justify-start"} mb-2`}>{c.role === "user" ? (<span className="bg-neutral-primary-soft border border-default text-heading text-sm font-medium px-1.5 py-0.5 rounded">{username}</span>) : (<span className="bg-neutral-primary-soft border border-solid text-heading text-sm font-medium px-1.5 py-0.5 rounded">Gethonis</span>)}</b>
						    <div
						      className={`p-2 max-w-xs  break-words whitespace-pre-wrap sm:max-w-xl no-scrollbar ${
						        c.role === "user" ? "transition-colors bg-blue-900 border border-solid border-white/[.145] items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-sm h-auto p-2 px-5 w-full overflow-scroll text-sm focus:outline-none rounded-md" : "transition-colors transition duration-700 ease-in-out font-bold text-sm sm:text-base h-auto p-2 px-5 w-full mr-2 sm:text-sm focus:outline-none"
						      }`}
						    >
						    
						    <ReactMarkdown
							  remarkPlugins={[remarkGfm]}
							  components={{
							    code({node, inline, className, children, ...props}) {
							      return !inline ? (
							        <pre
							          className="max-h-700 overflow-y-auto no-scrollbar bg-neutral-950 border border-white/[.145] text-white rounded-md p-5 my-5 text-md"
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
						<div className="h-30"/>
						<div ref={endRef}/>
				</div>
		
		</div>
		
		{/*
			<div className="bg-black w-screen h-[100dvh] overflow-hidden content-center no-scrollbar">
				
				
				<div className="w-full sm:pt-0 flex justify-center">
					<div className="w-full sm:w-3xl h-auto p-2 sm:p-5 rounded-lg ">
						
							      
					</div>

				</div>
				</div>
			</div> 
		*/}
				</>
	);
}

export { Dash };