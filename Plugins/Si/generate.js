
const fetch = require('node-fetch');

module.exports = {
  command: ['generate'],
  operate: async ({ Cypher, m, reply, text, prefix, command }) => {
    if (!text) return reply(`*Please provide a query to generate an image!*`);

    const api3Url = `https://api.gurusensei.workers.dev/dream?prompt=${encodeURIComponent(text)}`;
    try {
      await Cypher.sendMessage(m.chat, { image: { url: api3Url } }, { quoted: m });
    } catch (error) {
      console.error('Error generating image:', error);
      reply("*An error occurred while generating the image.*");
    }
  }
};