const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { message } = JSON.parse(event.body);

  const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_TOKEN;
  if (!HUGGING_FACE_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Hugging Face API token not configured.' }),
    };
  }

  const modelUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small'; 

  try {
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { text: message },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Hugging Face API responded with status ${response.status}.` }),
      };
    }

    const result = await response.json();

    console.log('Hugging Face API Response:', JSON.stringify(result));

    let generatedText = 'No response generated.';

    if (Array.isArray(result) && result.length > 0) {
      generatedText = result[0]?.generated_text;
    } else if (result?.generated_text) {
      generatedText = result.generated_text;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: generatedText }),
    };

  } catch (error) {
    console.error('Function execution error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process AI response. Check Netlify function logs.' }),
    };
  }
};
