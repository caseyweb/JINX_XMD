
const fetch = require('node-fetch');

module.exports = {
  command: ['dalle'],
  operate: async ({ Cypher, m, reply, text }) => {
    if (!text) return reply("*Please enter a query!*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(text)}`;
    try {
      await Cypher.sendMessage(m.chat, { image: { url: apiUrl } }, { quoted: m });
    } catch (error) {
      console.error('Error generating image:', error);
      reply("*An error occurred while generating the image.*");
    }
  }
};