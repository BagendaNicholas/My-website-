
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const { message } = JSON.parse(event.body);

    const HF_API_TOKEN = process.env.HF_API_TOKEN; // Your Hugging Face API key from Netlify environment variables

    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: message }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error }),
      };
    }

    const reply = data[0]?.generated_text || "Sorry, no response.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
