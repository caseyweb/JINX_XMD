
const fetch = require('node-fetch');

module.exports = {
  command: ['gpt2'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://bk9.fun/ai/jeeves-chat?q=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (!data.BK9) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.BK9);
      }
    } catch (error) {
      console.error('Error fetching response from GPT-2 API:', error);
      reply("An error occurred while fetching the response from GPT-2 API.");
    }
  }
};