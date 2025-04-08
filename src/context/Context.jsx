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
        setShowResult(true)

        let response;
        
    
        if(prompt !== undefined) {
            response = await run(prompt)
            setRecentPrompt(prompt)
        }

        else {
            setPrevPrompt(prev => [...prev, input])
            setRecentPrompt(input)
            response = await run(input)
        }

        if(response?.message == "image") {
            setImage(await response.data)
            
            setLoading(false)
            setInput("")
        }

        if(response?.message == "text") {
            let responseArray = await response.data.split("**")
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