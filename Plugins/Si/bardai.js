
const fetch = require('node-fetch');

module.exports = {
  command: ['bardai', 'bard'],
  operate: async ({ m, reply, text }) => {
    if (!text) return reply("*Please ask a question*");

    try {
      let response = await fetch(`https://restapi.apibotwa.biz.id/api/bard?message=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.result || data.result.length === 0) {
        return reply("*Please try again later or try another command!*");
      } else {
        reply(data.result); 
      }
    } catch (error) {
      console.error('Error fetching response from Bard API:', error);
      reply("An error occurred while fetching the response from Bard API.");
    }
  }
};