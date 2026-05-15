const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Loaded NVIDIA_API_KEY:', process.env.NVIDIA_API_KEY ? '✅ Present' : '❌ Missing');

const test = async () => {
  try {
    const client = new OpenAI({
      apiKey: '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',
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    console.log('Testing NVIDIA API Key...');
    const response = await client.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 100,
    });

    console.log('✅ API Key is VALID!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ API Key FAILED:', error.message);
  }
};

test();