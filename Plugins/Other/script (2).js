
const axios = require('axios');  
const fs = require('fs');
const tylorkid5 = fs.readFileSync("./Media/Images/Xploader5.jpg")

module.exports = {
  command: ['script', 'sc', 'repository', 'repo'],
  operate: async ({ m, Cypher, reply }) => {
    try {
      const me = m.sender;
      const response = await axios.get('https://api.github.com/repos/caseyweb/JINX_XMD');
      if (response.status === 200) {
        const repoData = response.data;
        const repos = `
*BOT NAME:*
> ${repoData.name}

*STARS:* 
> ${repoData.stargazers_count}

*FORKS:* 
> ${repoData.forks_count}

*GITHUB LINK:* 
https://github.com/caseyweb/JINX_XMD

@${me.split("@")[0]}👋, Don't forget to star and fork my repository😊

> ${global.wm}`;

        Cypher.sendMessage(m.chat, { text: repos, contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 9999, 
          isForwarded: true, 
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363345633217147@newsletter',
            serverMessageId: 20,
            newsletterName: global.botname,
          },
          externalAdReply: {
            title: global.botname,
            body: "",
            thumbnail: tylorkid5, 
            sourceUrl: null,
            mediaType: 1
          }
        }}, { quoted: m });
      } else {
        await reply(`Failed to fetch repository data!`);
      }
    } catch (error) {
      console.error(error);
      await reply(`Couldn't find repository!`);
    }
  }
};
