const fetch = require('node-fetch'); // or use the built-in fetch if your Netlify node version supports it

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Get the message from the request body
  const { message } = JSON.parse(event.body);

  // Retrieve the API key from environment variables
  const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_TOKEN;
  if (!HUGGING_FACE_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Hugging Face API token not configured.' }),
    };
  }

  // --- Configuration for your specific Hugging Face model ---
  // You need to replace this with your model's API endpoint
  const modelUrl = 'YOUR_HUGGING_FACE_MODEL_API_URL'; 

  try {
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
      }),
    });

    if (!response.ok) {
      // If the API returns an error status
      const errorText = await response.text();
      console.error('Hugging Face API Error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API responded with status ${response.status}: ${errorText}` }),
      };
    }

    const result = await response.json();

    // The Hugging Face API response structure can vary.
    // This is a common structure for a text generation model.
    const generatedText = result[0]?.generated_text || 'No response generated.';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: generatedText }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to Hugging Face API.' }),
    };
  }
};
