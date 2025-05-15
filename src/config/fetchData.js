import { CohereClientV2 } from 'cohere-ai';

const API_URL = import.meta.env.VITE_API_URL;

const run = async (prompt) => {
  const cohere = new CohereClientV2({ token: API_URL });

  const isAboutAgha = /agha naveed|syed naveed/i.test(prompt);
  
  const additionalContext = isAboutAgha
    ? `  :: If this prompt is asking about Agha Naveed or Syed Naveed, say something like this that agha naveed is software developer etc...
      if not asking about developer then dont response with above information.

      - If the response mentions the AI team or developers, then say something like this that agha naveed is software developer etc...`
    : `If your generated response mentions the team or developer of this AI model, say:
      - "Agha Naveed is the CEO and a developer of Agha AI Chatbot."
      - Avoid mentioning unrelated topics, and don't include disclaimers like:
        "Please note that this statement is not accurate in the context of my development..." & and your given prompt is not about developer/team etc.`;

  const promptWithContext = `${prompt}\n\n${additionalContext}`;

  const result = await cohere.chat({
    model: 'command-a-03-2025',
    messages: [{ role: 'user', content: promptWithContext }],
  });

  if (result?.message?.content?.[0]?.text) {
    const responseText = applyBranding(result.message.content[0].text);
    return { message: 'text', data: responseText };
  }

  return { message: 'error', data: 'No content generated.' };
};

function applyBranding(text) {
  return text
    .replace(/Cohere/g, 'Agha Naveed')
    .replace(/OpenAI/g, 'Agha Naveed')
    .replace(/\bGPT\b/g, 'Agha AI')
    .replace(/Generative Pre-trained Transformer/g, 'Agha Artificial Intelligence Chatbot')
    .replace(/https:\/\/(cohere\.ai|openai\.com)/g, 'https://agha-naveed.vercel.app');
}

export default run;
