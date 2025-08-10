
exports.handler = async (event, context) => {
  try {
    const { message } = JSON.parse(event.body);

   
    const apiKey = process.env.api key; // Use the name you gave it in the Netlify dashboard

    const response = await fetch('https://api.your-ai-provider.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "your-model-name", // e.g., "gpt-3.5-turbo"
        prompt: message,
        max_tokens: 150
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices[0].text 
      })
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get a response from the AI.' })
    };
  }
};

