
const fetch = require('node-fetch');

module.exports = {
  command: ['photoai'],
  operate: async ({ Cypher, m, reply, text, prefix, command }) => {
    if (!text) return reply(`*Please provide a query to generate an image!*`);

    const apiUrl = `https://api.tioo.eu.org/dalle?text=${encodeURIComponent(text)}`;
    try {
      await Cypher.sendMessage(m.chat, { image: { url: apiUrl } }, { quoted: m });
    } catch (error) {
      console.error('Error generating image:', error);
      reply("An error occurred while generating the image.");
    }
  }
};