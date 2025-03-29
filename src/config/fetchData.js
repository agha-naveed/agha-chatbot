import { CohereClientV2 } from 'cohere-ai'

const run = async(prompt) => {
  const cohere = new CohereClientV2({
    token: `AJLCCW6irAVOe0wNv2JVBRXqB59SBWdVkuw4fIR4`,
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
    console.log(result.message.content[0].text)
    return result.message.content[0].text.replaceAll("Cohere", "Agha Naveed")
  }
}
  
export default run;