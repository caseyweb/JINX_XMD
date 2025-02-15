
const fetch = require('node-fetch');

module.exports = {
  command: ['openai', 'ai'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://restapi.apibotwa.biz.id/api/openai?message=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.data || !data.data.response) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.data.response);
      }
    } catch (error) {
      console.error('Error fetching response from OpenAI API:', error);
      reply("An error occurred while fetching the response from OpenAI API.");
    }
  }
};