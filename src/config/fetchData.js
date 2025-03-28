import ('dotenv').config();
const run = async(prompt) => {
  const url = 'https://chatgpt-42.p.rapidapi.com/deepseekai';
  const options = {
      method: 'POST',
      headers: {
          'x-rapidapi-key': "67f58cb165mshe057a1e48ceb048p160ec4jsn0a3da1c96fe8",
          'x-rapidapi-host': "chatgpt-42.p.rapidapi.com",
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          messages: [
                {
                    role: 'user',
                    content: prompt
                }
          ],
          web_access: false
      })
  };
  const response = await fetch(url, options);
  const result = await response.json();

  if(result) {
    return result.result.replaceAll("DeepSeek", "Agha Naveed AI")
  }
}
  
export default run;