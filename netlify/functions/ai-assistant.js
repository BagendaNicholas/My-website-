// This is your Netlify Function, for the OpenAI API

exports.handler = async (event, context) => {
  try {
    const { message } = JSON.parse(event.body);

    // This is the API key you stored in Netlify's environment variables
    const apiKey = process.env.OPENAI_API_KEY;

    // OpenAI API endpoint for chat completions
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    
    // Check if the response contains a valid message
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: reply })
      };
    } else {
       return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to get a valid response from the OpenAI API.' })
      };
    }
    
  } catch (error) {
    console.error('API Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get a response from the AI.' })
    };
  }
};
