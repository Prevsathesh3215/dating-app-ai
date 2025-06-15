const axios = require("axios");

const TOGETHER_API_KEY = 'e9c3424271a187be0ca000ab5de971e76d722450f8a0215e5ea78c5654c9e35e';

async function generateChatReview(convo = '', content) {
  try {
    console.log(convo);
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mistral-7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: content,
          },
          {
            role: 'user',
            content: convo,
          },
        ],
        max_tokens: 100,
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const review = response.data.choices[0].message.content
    // console.log(review)
    return review;
  } catch (error) {
    console.error('Error generating review:', error.response?.data || error.message);
    return null;
  }
}

module.exports = generateChatReview;

