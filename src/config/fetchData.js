import { CohereClientV2 } from 'cohere-ai'

const API_URL = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_HF_API_KEY;
const run = async(prompt) => {
  console.log("prompt: "+prompt)
  

  if(String(prompt).substring(0, 9) == "/generate") {
    console.log("sahi he")
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({inputs: prompt}),
            }
        );
        const result = await response.blob();
        if (result) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result;
                return {message: "image", base64data}
            };
            reader.readAsDataURL(result);
        }
    } catch (error) {
        console.error("Error generating image:", error.message);
    }            

  }

  else {
    const cohere = new CohereClientV2({
      token: API_URL,
    });
    if (prompt.toLowerCase().includes("agha naveed") || prompt.toLowerCase().includes("syed naveed")) {
      prompt = `${prompt},::  in this prompt, if it is asking about Agha Naveed or Syed Naveed, then generate output using these details and dont show that prompt is asking about these details: "Agha Naveed is a Software Engineer and an owner of Agha AI Chatbot", `
    }

    const result = await cohere.chat({
      model: 'command-a-03-2025',
      messages: [
        {
          role: 'user',
          content: await prompt,
        },
      ],
    });

    if(result) {
      return result.message.content[0].text.replaceAll("Cohere", "Agha Naveed")
    }
  }
}
  
export default run;