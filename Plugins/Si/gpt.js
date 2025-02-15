
const axios = require('axios');

module.exports = {
  command: ['gpt'],
  operate: async ({ reply, m, text }) => {
    async function fetchDeepSeek(query) {
      let { data } = await axios.post("https://api.blackbox.ai/api/chat", {
        messages: [{ id: null, role: "user", content: query }],
        userSelectedModel: "deepseek-v3"
      });
      return data;
    }

    try {
      if (!text) return reply('*Please ask a question*');
      const result = await fetchDeepSeek(text);
      reply(result);
    } catch (error) {
      console.error('Error in GPT plugin:', error);
      reply('An error occurred!');
    }
  }
};