
const fetch = require('node-fetch');

module.exports = {
  command: ['blackbox'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://api.siputzx.my.id/api/ai/blackboxai?content=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.status || !data.data) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.data);
      }
    } catch (error) {
      console.error('Error fetching response from BlackboxAI API:', error);
      reply("An error occurred while fetching the response from BlackboxAI API.");
    }
  }
};