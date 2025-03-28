const run = async(prompt) => {
  const url = 'https://chatgpt-42.p.rapidapi.com/deepseekai';
  const options = {
      method: 'POST',
      headers: {
          'x-rapidapi-key': process.env.API_KEY ?? "",
          'x-rapidapi-host': process.env.API_HOST ?? "",
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