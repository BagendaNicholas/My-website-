
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
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

  // --- Configuration for the DialoGPT model ---
  const modelUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small'; 

  try {
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      // The API for DialoGPT often expects a 'text' field inside 'inputs'
      body: JSON.stringify({
        inputs: { text: message },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Log the full error to Netlify logs for debugging
      console.error('Hugging Face API Error:', response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Hugging Face API responded with status ${response.status}.` }),
      };
    }

    const result = await response.json();

    // Log the full successful response for debugging
    console.log('Hugging Face API Response:', JSON.stringify(result));

    let generatedText = 'No response generated.';

    // The API might return an array of objects or a single object.
    if (Array.isArray(result) && result.length > 0) {
      // Handle the array case
      generatedText = result[0]?.generated_text;
    } else if (result?.generated_text) {
      // Handle the single object case
      generatedText = result.generated_text;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: generatedText }),
    };

  } catch (error) {
    // Log the full crash error for debugging
    console.error('Function execution error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process AI response. Check Netlify function logs.' }),
    };
  }
};
