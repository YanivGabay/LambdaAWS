const fetch = require('node-fetch');

exports.handler = async (event) => {
  const input = JSON.parse(event.body).prompt;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", 
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: input }
        ],
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Adjusted to access the 'text' property for the output
    return {
      statusCode: 200,
      body: JSON.stringify({ output: data.choices[0].text })
    };
  } catch (error) {
    console.error(error); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
