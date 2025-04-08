import { createContext, useState } from "react";
import run from "../config/fetchData";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompt, setPrevPrompt] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")
    const [image, setImage] = useState("")
    const [isImage, setIsImage] = useState(false)
    

    function delayPara(index, nextWord) {
        setTimeout(() => {
            setResultData(prev => prev + nextWord)
        }, 75 * index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setIsImage(false)
        setShowResult(true)

        let response;

        if(String(prompt).substring(0, 9) == "/generate") {

            setPrevPrompt(prev => [...prev, input])
            setRecentPrompt(input)

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
                    };
                    reader.readAsDataURL(result);
                }
            } catch (error) {
                console.error("Error generating image:", error.message);
            }            


            setLoading(false)
        }

        else {

            if(prompt !== undefined) {
                response = await run(prompt)

                setRecentPrompt(prompt)
            }

            else {
                setPrevPrompt(prev => [...prev, input])
                setRecentPrompt(input)
                response = await run(input)
            }
            
            let responseArray = response.split("**")
            let newResponse = "";
            for(let i = 0; i < responseArray.length; i++) {
                if(i == 0 || i % 2 !== 1) {
                    newResponse += responseArray[i]
                }
                else {
                    newResponse += `<b>${responseArray[i]}</b>`
                }
            }

            let newResponse2 = newResponse.split("*").join("<br />")
            
            let newResponseArray = newResponse2.split(" ");
            
            for(let i=0; i<newResponseArray.length; i++) {

                const nextWord = newResponseArray[i];

                delayPara(i, nextWord + " ")
            }
            setLoading(false)
            setInput("")
        }
    }


    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        setShowResult,
        newChat,
        image
    }

    return (
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;