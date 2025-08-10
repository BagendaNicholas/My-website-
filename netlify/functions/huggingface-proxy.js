js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const { message } = JSON.parse(event.body);

    const HF_API_TOKEN = process.env.HF_API_TOKEN;

    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: message,
        parameters: { max_length: 100 }
      }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error }),
      };
    }

    // GPT-2 API returns an array of generated text objects
    const generatedText = data[0]?.generated_text || "Sorry, I couldn't generate a response.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: generatedText }),
    };
  } catch (error) {
    return {
      statusCode: 500,
 body: JSON.stringify({ error: error.message }),
    };
  }
};

