const { formatSize, checkBandwidth, runtime} = require('../../lib/function');
const checkDiskSpace = require('check-disk-space').default;
const os = require('os');
const performance = require('perf_hooks').performance;
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001); 

module.exports = {
  command: ['botstatus', 'statusbot'],
  operate: async (context) => {
    const { Cypher, m, reply, mess } = context;
 

    const used = process.memoryUsage();
    const cpus = os.cpus().map((cpu) => {
      cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
      return cpu;
    });
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
      last.total += cpu.total;
      last.speed += cpu.speed / length;
      last.times.user += cpu.times.user;
      last.times.nice += cpu.times.nice;
      last.times.sys += cpu.times.sys;
      last.times.idle += cpu.times.idle;
      last.times.irq += cpu.times.irq;
      return last;
    }, {
      speed: 0,
      total: 0,
      times: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0,
      },
    });

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ram = `${formatSize(process.memoryUsage().heapUsed)} / ${formatSize(os.totalmem())}`;
    const cpuModel = os.cpus();
    const freeRam = os.freemem();
    const totalRam = os.totalmem();
    const percentRam = (freeRam / totalRam) * 100;
    const usedRamPercent = 100 - percentRam;
    const usedRam = totalRam - freeRam;

    const space = await checkDiskSpace(process.cwd());
    const freeSpace = space.free;
    const totalSpace = space.size;
    const usedSpace = totalSpace - freeSpace;

    const startTime = performance.now();
    await reply("Calculating ping...");
    const endTime = performance.now();
    const latency = endTime - startTime;

    const { download, upload } = await checkBandwidth();
    const response = ` *PING* 
> ${latency.toFixed(2)} ms 

 *RUNTIME*
> ${runtime(process.uptime())} 

 *SERVER* 
 
 RAM:
> ${formatSize(usedRam)} (${usedRamPercent.toFixed(2)}%) / ${formatSize(totalRam)} 

 FREERAM:
> ${formatSize(freeRam)} 

 MEMORY:
> ${ram}

 DISK:
> ${formatSize(usedSpace)} / ${formatSize(totalSpace)}

 FREEDISK:
> ${formatSize(freeSpace)}
 
 PLATFORM:
> ${os.platform()}

 SERVER:
> ${os.hostname()}

 BOT'S UPLOADED:
> ${upload}

 BOT'S DOWNLOADED:
> ${download}

 SERVER TIME: 
> ${hours} : ${minutes} : ${seconds}
 
 NODEJS VERSION:
> ${process.version}

 CPU MODEL:
> ${cpuModel[0].model}

 OS VERSION:
> ${os.version()}
 
${readmore}
NodeJS Memory Usage
${Object.keys(used)
  .map((key) => `${key.padEnd(15, ' ')}: ${formatSize(used[key])}`)
  .join("\n")}
${readmore}
${cpus[0]
  ? `Total CPU Usage
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times)
  .map((type) => `- *${(type + "*").padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`)
  .join("\n")}
CPU Core(s) Usage (${cpus.length} Core CPU)
${cpus
  .map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times)
  .map((type) => `- *${(type + "*").padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`)
  .join("\n")}`)
  .join("\n\n")}`
  : ""
}
`.trim();

    Cypher.relayMessage(m.chat, {
      requestPaymentMessage: {
        currencyCodeIso4217: 'USD',
        requestFrom: '0@s.whatsapp.net',
        noteMessage: {
          extendedTextMessage: {
            text: response,
            contextInfo: {
              mentionedJid: [m.sender],
              externalAdReply: {
                showAdAttribution: true
              }
            }
          }
        }
      }
    }, {});
  }
};