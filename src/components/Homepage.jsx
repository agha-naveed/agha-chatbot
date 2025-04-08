import React, { useContext, useRef, useState } from 'react'
import DOMPurify from 'dompurify';
import "@fontsource/poppins"
import logo from '../assets/my-logo.webp'
import { IoSearch, IoSettings, IoCloseOutline, IoAdd } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { CgMenuLeft } from "react-icons/cg";
import { Context } from '../context/Context';
import { FaImage } from "react-icons/fa6";

export default function Homepage() {
    const apiKey = import.meta.env.VITE_HF_API_KEY;
    let [sidebar, setSidebar] = useState(false)
    let ref = useRef()
    const [image, setImage] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);

    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input, prevPrompt, setRecentPrompt, newChat, setShowResult} = useContext(Context)

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt)
        await onSent(prompt)
    }

    const pressEnter = (e) => {
        if(e.key == "Enter") {
            if(input)
                onSent()
        }

    }
    const getSearchData = (e) => {
        setInput(e.target.value)
    }
    
    // Image Generate
    const imageFunction = async () => {
        setImgLoading(true)
        setShowResult(true)
        setImage(null)
    
        try {
            const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({inputs: input}),
                }
            );
            const result = await response.blob();
            if (result) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    setImage(base64data);
                    console.log(base64data)
                    console.log("Loading")
                    setImgLoading(false);
                };
                reader.readAsDataURL(result);
            }
        } catch (error) {
            console.error("Error generating image:", error.message);
        }
    }


    const wrapCodeBlocks = (content) => {
        content = content.replace(/```(.*?)```/gs, (match, code) => {
          return `<pre><code>${escapeHTML(code)}</code></pre>`;
        });

        content = content.replace(/`(.*?)`/g, (match, code) => {
            return `<code>${escapeHTML(code)}</code>`;
          });

        return content
      };
      
      const escapeHTML = (html) => {
        return html.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;");
      };
      
      const renderContent = (content) => {
        const wrappedContent = wrapCodeBlocks(content);
        return DOMPurify.sanitize(wrappedContent);
      };
      
      const sanitizedHTML = renderContent(resultData);



    return (
        <div className='w-full min-h-screen bg-slate-800 text-white grid items-center p-5 font-poppins'>
            <nav className='flex justify-between place-self-start w-full h-[60px] items-center p-5 z-50'>
                
                <button onClick={() => {setSidebar(!sidebar)}} className="setting-btn flex lg:hidden text-[26px] font-bold text-white  rounded-full p-2">
                    <CgMenuLeft />
                </button>

                <img src={logo} alt="Agha Naveed Logo" className='w-[50px] h-[50px] lg:block hidden' />
                <div className='space-x-2'>
                    <a href='#' className='bg-white py-[5px] px-[13px] rounded-[24px] text-sm font-bold items-center justify-center text-slate-800'>Log in</a>
                    <a href='#' className='outline outline-1 outline-slate-500 py-[5px] px-[13px] rounded-[24px] text-sm  items-center justify-center text-white'>Sign up</a>
                </div>
            </nav>
            
            <div className="bg-light fixed">
                <img loading='eager' src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/600px-Earth_Western_Hemisphere_transparent_background.png" className='select-none' alt="" />
                
                <img src="https://www.freeiconspng.com/thumbs/light-png/brown-light-png-3.png" loading='eager' alt="" />
                
            </div>

            <div className="bg-clr md:hidden block">
            </div>

            <div className="md:container w-[100%] z-50 mx-auto md:max-w-3xl sm:h-full h-[90vh] flex flex-col items-center justify-between">
                
                <div className="output w-full h-full content-end min-h-auto pb-[20px]">
                    {
                        !showResult ?
                        <div className="placeholder px-12 py-8 my-20">
                            <img src={logo} alt="Agha Naveed Logo" className='w-[50px] h-[50px] block lg:hidden absolute top-[30%] left-[50%] opacity-30' />
                            <h1 className='p-holder-heading text-6xl font-bold'>Hello, Dev.</h1>
                            <h2 className='p-holder-heading text-4xl'>How Can I Assist You?</h2>
                        </div>
                        
                        : imgLoading ?
                            <div className='result'>
                                <div className="result-title flex">
                                    <p className='w-full flex place-content-end'>
                                        <span className='bg-slate-600 px-5 py-3 rounded-[28px]' title={recentPrompt}>
                                            {recentPrompt}
                                        </span>
                                    </p>
                                </div>
                                <div className="result-data sm:flex grid">
                                    <img src={logo} className='w-10' alt="Agha-Chatbot Logo" />
                                    {
                                        loading ? 
                                        <div className='loader'>
                                            Loading...
                                        </div>
                                        :
                                        <p className="result-text" dangerouslySetInnerHTML={{ __html: sanitizedHTML}} ></p>
                                    }
                                    
                                    
                                    
                                </div>
                            </div>
                        :
                        <div className='result'>
                            <div className="result-title flex">
                                <p className='w-full flex place-content-end'>
                                    <span className='bg-slate-600 px-5 py-3 rounded-[28px]' title={recentPrompt}>
                                        {input}
                                    </span>
                                </p>
                            </div>
                            <div className="result-data sm:flex grid">
                                <img src={logo} className='w-10' alt="Agha-Chatbot Logo" />
                                {
                                    imgLoading ? 
                                    <div className='loader text-white'>
                                        Generating...
                                    </div>
                                    :
                                    <div className='w-full'>
                                        <img src={image} alt="" />
                                    </div>
                                }
                            </div>
                        </div>

                    }
                </div>

                <div className="search-bar w-full grid">
                    <div className='w-full flex text-black'>

                        
                        <input type="text" ref={ref} placeholder='Enter Prompt...' className='w-full h-12 text-black border-none outline-none rounded-l-3xl pl-6 pr-1' onChange={getSearchData} value={input} onKeyDown={pressEnter} />
                        
                        
                        <button title='Generate an Image' onClick={() => {imageFunction()}} className="bg-white h-auto px-[7px]">
                            <FaImage className='w-[40px] h-[40px] p-[7px] text-2xl text-slate-800' />
                        </button>
                        
                        <button title='Search Text...' onClick={() => {input && onSent()}} className="search-icon bg-white rounded-r-3xl h-auto px-[7px]">
                            <IoSearch className='w-[40px] h-[40px] p-[7px] text-2xl text-white rounded-full bg-slate-800' />
                        </button>

                    </div>
                    <p className='text-center text-sm mt-2'>All rights reserved with AghaNaveed ©</p>
                </div>
                
            </div>

            <button onClick={() => {setSidebar(!sidebar)}} className="setting-btn fixed lg:flex hidden right-5 bottom-5 text-[26px] text-slate-800 bg-white rounded-full p-2">
                <IoSettings />
            </button>
  

            {/* ---------------   SideBar   --------------- */}

            <div className = {`${sidebar && "toggle-sidebar"}` + " setting-tab transition-all fixed top-0 md:-left-[50%] -left-[100%] p-5 bg-slate-950 w-[335px] z-[60] h-full"}>
                <div className='w-full flex justify-end'>
                    <button onClick={() => {setSidebar(false)}}>
                        <IoCloseOutline className='text-2xl' />
                    </button>
                </div>

                <a href="#" onClick={() => newChat()} className='bg-white mt-14 text-slate-800 text-sm px-3 py-2 rounded-[28px] flex items-center w-fit gap-1'>
                    <IoAdd className='text-[20px]' /> <span> New Chat </span>
                </a>
                
                <p className='mt-8'>Recent</p>
                <div className="recent-search-div px-1 py-2">
                    <ul>
                        {
                            prevPrompt.map((item, index) => {
                            return (
                                    <li onClick={() => loadPrompt(item)} key={`prev-prompt-${index}`}>
                                        <FiMessageSquare className='msg-icn' />
                                        <span>{item}</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            
        </div>  
    )
}
