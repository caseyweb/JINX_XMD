const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');

const MEMORY_LIMIT = 250;
const RESTART_DELAY = 3000;

const TIMEZONE = global.timezones || "Africa/Nairobi";

function getLogFileName() {
  const today = moment(Date.now()).tz(TIMEZONE);
  return `${today.format('YYYY-MM-DD')}.log`;
}

function createTmpFolder() {
const folderName = "tmp";
const folderPath = path.join(__dirname, folderName);

if (!fs.existsSync(folderPath)) {
fs.mkdirSync(folderPath);
   }
 }
 
createTmpFolder();

function logMessage(message) {
  const timestamp = moment(Date.now()).tz(TIMEZONE).locale('en').format('HH:mm z');
  console.log(`[CYPHER-X] ${message}`);
  fs.appendFileSync(path.join(__dirname, 'tmp', getLogFileName()), `[${timestamp}] ${message}\n`);
}

function start() {
  process.env.NODE_OPTIONS = '--no-deprecation';

  const args = [path.join(__dirname, 'core.js'), ...process.argv.slice(2)];
  
  logMessage('Starting...');

  const logFilePath = path.join(__dirname, 'tmp', getLogFileName());
  const errorLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

  let p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'pipe', 'ipc'],
  });

  p.stderr.on('data', (data) => {
    const errorMsg = `[${moment(Date.now()).tz(TIMEZONE).locale('en').format('HH:mm z')}] ${data.toString()}`;
    console.error(errorMsg);
    errorLogStream.write(errorMsg);
  });

  const memoryCheckInterval = setInterval(() => {
    try {
      const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
      if (memoryUsage > MEMORY_LIMIT) {
        logMessage(`Memory usage exceeded ${MEMORY_LIMIT}MB. Restarting...`);
        p.kill();
      }
    } catch (error) {
      logMessage(`Memory check failed: ${error.message}`);
    }
  }, 60000);

  p.on('exit', (code) => {
    clearInterval(memoryCheckInterval);
    logMessage(`Exited with code: ${code}`);

    if (code === 0 || code === 1 || code === 401) {
      setTimeout(start, RESTART_DELAY);
    }
  });

  const handleShutdown = (signal) => {
    logMessage(`Shutting down CypherX due to ${signal}...`);
    p.kill();
    errorLogStream.end();
    process.exit(0);
  };

  process.removeAllListeners('SIGINT');
  process.removeAllListeners('SIGTERM');

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
}

start();