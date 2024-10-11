import { createContext, useState } from "react";
import run from "../config/fetchData";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    function delayPara(index, nextWord) {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;

        if (prompt !== undefined) {
            response = prompt;
        } else {
            setPrevPrompt(prev => [...prev, input]);
            setRecentPrompt(input);
            response = input;
        }

        // Provide context to the AI to recognize questions about the name
        const aiPrompt = `User asked: "${response}". If the user is asking about your identity, respond with "Hi! I'm Agha AI Chatbot".`;

        // Get the response from the AI model
        const aiResponse = await run(aiPrompt);

        // Process and display the AI response
        let responseArray = aiResponse.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += `<b>${responseArray[i]}</b>`;
            }
        }

        let newResponse2 = newResponse.split("*").join("<br />");
        let newResponseArray = newResponse2.split(" ");

        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }

        setLoading(false);
        setInput("");
    };

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
        newChat,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
