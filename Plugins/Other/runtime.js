
const fs = require('fs');
const { runtime } = require('../../lib/myfunc'); 

module.exports = {
  command: ['runtime', 'uptime'],
  operate: async (context) => {
    const { Cypher, m, reply } = context;
    const pinga = `*${runtime(process.uptime())}*`;

    try {
      await Cypher.sendMessage(m.chat, {
        text: pinga, 
        footer: wm,
        buttons: [
          {
            buttonId: `${global.prefixz}menu`,
            buttonText: { displayText: 'Menu' }
          },
          {
            buttonId: `${global.prefixz}ping`,
            buttonText: { displayText: "Ping" }
          }
        ],
        headerType: 6, 
        viewOnce: true
      }, { quoted: m });
    } catch (error) {
      console.error('Error sending runtime message:', error);
      reply('An error occurred while sending the runtime message.');
    }
  }
};