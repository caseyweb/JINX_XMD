
const fetch = require('node-fetch');

module.exports = {
  command: ['llama'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://bk9.fun/ai/llama?q=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (!data.BK9) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.BK9);
      }
    } catch (error) {
      console.error('Error fetching response from Llama API:', error);
      reply("An error occurred while fetching the response from Llama API.");
    }
  }
};