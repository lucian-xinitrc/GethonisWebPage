'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { FaPaperPlane, FaPaperclip, FaLock } from 'react-icons/fa';
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Dash = ({ id, username, token, gethoniskey}) => {
  	const chatContainerRef = useRef(null);
  	const [checked, setChecked] = useState(false);
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
	  	const location = (checked) ? "/api/gethonisAPIDebate" : "/api/gethonisAPI";
	  	const result = await fetch(
		    location, {
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
		<div className={` ${init === false ? "h-screen" : "h-auto"} bg-black w-auto overflow-hidden content-center no-scrollbar font-sans`}>
			<div className={` ${init === false ? "" : "align-center fixed absolute"} w-full flex justify-center bg-black pt-3 pb-3 shadow-black shadow-lg/30`}>
				
				<Image src="/images/logo.png" alt="Imagine full screen" className="rounded-[5px] shadow-xl/30" width={50} height={50}/>
				<h1 className="text-[#1793d1] font-extrabold pt-2 pl-2 text-3xl font-sans">Gethonis {checked ? (<span className="bg-red border border-red-400 text-red-400 text-xs font-medium px-1.5 py-0.5 rounded top-0">Debate Mode</span>) : ""}</h1>

			</div>
		<div className="flex justify-center bg-transparent pt-5">
				{init === false ? (<h3 className="font-bold text-gray-500 sm:w-auto break-words whitespace-pre-wrap max-w-xs text-center">Welcome to Gethonis, the perfect squad!</h3>) : ("") }
				</div>
		<div className={` ${init === false ? "" : "bottom-0 fixed mb-10"} w-full absolute left-0 flex justify-center`}>

			<form onSubmit={(e) => { 
					  e.preventDefault();
					  handleGettingMessage(); 
					}}>
					
					<div className="mx-1 sm:w-[700px] bg-black flex justify-center mt-5 p-2 border border-solid border-white/[.145] ransition duration-700 ease-in-out hover:shadow-white/[.145] shadow-lg/30 rounded-2xl">
						
						<button className="hidden rounded-full w-12 h-10 overflow-hidden border text-white border border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaLock size={15} />
			            </button>
			            <div className="text-white rounded-full ml-1 w-auto px-5 h-10 overflow-hidden text-white hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
							<label className="inline-flex sm:items-center cursor-pointer">
							  <input id="default-checkbox" type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}  className="sr-only peer"/>
							  <div className="border border-white relative w-9 h-5.5 bg-neutral-quaternary outline-none peer-focus:outline-none peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand outline-none"></div>
							  <span className="select-none ms-1 sm:ms-3 text-sm font-medium text-heading">Debate</span>
							</label>
						</div>
						<textarea type="text"
			              placeholder="Ask me anything!"
			              value={message}
			              onChange={e => setMessage(e.target.value)}
			              type="text"
			              aria-describedby="helper-text-explanation" 
			              className="min-h-10 transition-colors flex items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-base h-10 p-2 px-5 w-full mr-2 sm:text-sm focus:outline-none text-white no-scrollbar">
			            </textarea>
			            <button className="hidden rounded-full w-12 h-10 overflow-hidden border text-white border border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[14px]">
			              <FaPaperclip size={15} />
			            </button>
			            <button type="submit"  className="text-white rounded-full ml-2 w-20 h-10 overflow-hidden border-solid hover:dark:border-white/[.145] border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-transparent font-bold text-sm sm:text-base  sm:text-[15px]">
			              <FaPaperPlane size={15} />
			            </button>
						      
					
					</div>
				</form>
				</div>
				<div className="w-full flex justify-center">
				<div ref={chatContainerRef} className={` ${init === false ? "hidden" : "block"} text-white mt-[20%] sm:mt-[10%] p-5 w-[80%] lg:w-[50%] sm:w-[80%] sm:p-10 overflow-scroll rounded-lg no-scrollbar `}>
					{chat.map((c, i) => (
						<div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"} mb-5`}>	
						  <div>
						  <b className={`flex ${c.role === "user" ? "justify-end" : "justify-start"} mb-2`}>{c.role === "user" ? (<span className="bg-neutral-primary-soft border border-default text-heading text-sm font-medium px-1.5 py-0.5 rounded">{username}</span>) : (<span className="bg-neutral-primary-soft border border-solid text-heading text-sm font-medium px-1.5 py-0.5 rounded">Gethonis</span>)}</b>
						    <div
						      className={`p-2 max-w-xs  break-words whitespace-pre-wrap sm:max-w-xl no-scrollbar ${
						        c.role === "user" ? "transition-colors bg-blue-900 border border-solid border-white/[.145] items-center justify-center transition duration-700 ease-in-out font-bold text-sm sm:text-sm h-auto p-2 px-5 w-full overflow-scroll text-sm focus:outline-none border border-solid border-white/[.145] transition duration-700 ease-in-out rounded-2xl" : "transition-colors font-bold text-sm sm:text-base h-auto p-2 px-5 w-full mr-2 sm:text-sm focus:outline-none border border-solid border-white/[.145] transition duration-700 ease-in-out rounded-2xl py-3"
						      }`}
						    >
						    
						    <ReactMarkdown
					            remarkPlugins={[remarkGfm]}
					            components={{
					              p: ({children}) => (
					                <p className="mb-3 last:mb-0 leading-7">{children}</p>
					              ),

					              ul: ({children}) => (
					                <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
					              ),

					              ol: ({children}) => (
					                <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
					              ),

					              code({inline, className, children, ...props}) {
					                if (inline) {
					                  return (
					                    <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">
					                      {children}
					                    </code>
					                  );
					                }

					                return (
					                  <pre className="bg-black/60 border border-white/10 rounded-lg p-4 my-4 overflow-x-auto text-sm fancy-scrollbar">
					                    <code className={className}>{children}</code>
					                  </pre>
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
		
		</div>
				</>
	);
}

export { Dash };