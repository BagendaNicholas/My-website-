// This is your Netlify Function, to be saved as netlify/functions/ai-assistant.js

exports.handler = async (event, context) => {
  try {
    const { message } = JSON.parse(event.body);

    // This is the API key you stored in Netlify's environment variables
    const apiKey = process.env.AI_ASSISTANT_KEY;

    // Google's Gemini-pro API endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      })
    });

    const data = await response.json();
    console.log(data);

    // Check if the response contains a valid message
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const reply = data.candidates[0].content.parts[0].text;
      
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: reply })
      };
    } else {
       return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to get a valid response from the Gemini API.' })
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
