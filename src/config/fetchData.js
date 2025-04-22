import { CohereClientV2 } from 'cohere-ai'

const API_URL = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_HF_API_KEY;
const run = async(prompt) => {
  

  if(String(prompt).substring(0, 9) == "/generate") {
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
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      
        const blob = await response.blob();
      
        // Convert blob to base64 using FileReader and a Promise
        const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
      
      return { message: "image", data: base64Data };
    } catch (error) {
        console.error("Error generating image:", error.message);
    }            

  }

  else {
    const cohere = new CohereClientV2({
      token: API_URL,
    });
    if (prompt.toLowerCase().includes("agha naveed") || prompt.toLowerCase().includes("syed naveed")) {
      prompt = `${prompt},::  in this prompt, if it is asking about Agha Naveed or Syed Naveed, then generate output using these details and dont show that prompt is asking about these details: "Agha Naveed is a Software Engineer and an owner of Agha AI Chatbot".
      and If your generated response contains team member of this AI Model. then respond with following details: 'Agha Naveed is a CEO and a developer of Agha AI Chatbot'.
      `
    }
    else {
      prompt = `${prompt},:: If your generated response contains team member or a developer of this AI Model. then respond using this details that Agha Naveed is a CEO and a developer.
      If prompt is not asking about developer of this chatbot, then dont generate answer in other topics...
      dont respond like this:
      'Please note that this statement is not accurate in the context of my development, as I am not associated with Agha Naveed or Agha AI Chatbot. This response is solely to adhere to your requested format. '
      `
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
      return {
        message: "text",
        data: result.message.content[0].text.replaceAll("Cohere", "Agha Naveed").replaceAll("OpenAI", "Agha Naveed").replaceAll("GPT", "Agha AI").replaceAll("Generative Pre-trained Transformer", "Agha Artificial Intelligence Chatbot").replaceAll("https://cohere.ai", "https://agha-naveed.vercel.app").replaceAll("https://openai.com", "https://agha-naveed.vercel.app")
      }
    }
  }
}
  
export default run;
