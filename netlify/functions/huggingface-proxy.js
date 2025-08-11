// This file should be placed at: netlify/functions/huggingface-proxy.js

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
      body: JSON.stringify({ error: 'Hugging Face API token not configured. Please set it in Netlify environment variables.' }),
    };
  }

  // --- Configuration for the DialoGPT model ---
  // This is the correct API URL for microsoft/DialoGPT-small
  const modelUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small'; 

  try {
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      // The Hugging Face API for DialoGPT often expects a 'text' field, not 'inputs'
      body: JSON.stringify({
        inputs: {
          text: message,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API responded with status ${response.status}. See Netlify logs for details.` }),
      };
    }

    const result = await response.json();

    // The Hugging Face API response structure can vary.
    // For DialoGPT, the reply is often in result.generated_text
    const generatedText = result?.generated_text || 'No response generated.';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: generatedText }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to connect to Hugging Face API. Check Netlify function logs.' }),
    };
  }
};
