
const moment = require('moment-timezone');

module.exports = {
  command: ['time', 'date'],
  operate: async (context) => {
    const { Xploader, m, reply } = context;

    const xpday = moment(Date.now()).tz(global.timezones).locale('en').format('dddd');
    const xptime = moment(Date.now()).tz(global.timezones).locale('en').format('HH:mm:ss z');
    const lowq = `*TIME*:\n${xptime}\n\nDATE*:\n${xpday}`;

    try {
      reply(lowq);
    } catch (error) {
      console.error('Error sending time and date message:', error);
      reply('An error occurred while fetching the time and date.');
    }
  }
};
