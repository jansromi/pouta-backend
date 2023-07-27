const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { generateTimestamp } = require('../libs/date.js');

function logClient(req) {
  let logMsg = `Received request from ${req.ip}\n`;
  let date = new Date();
  timestamp = generateTimestamp(date);
  logMsg += `Time of request: ${timestamp}\n`;

  let filename = `pouta-logs/pouta-clientlogs/pouta-client-log-${timestamp}.txt`;
  
  // Convert the filename to absolute path
  let absolutePath = path.join(os.homedir(), filename);
  
  appendToFile(absolutePath, logMsg);
}

function logEvent() {

}

async function appendToFile(fileName, data) {
  try {
    await fs.appendFile(fileName, data + '\n');
    console.log(`Data appended to ${fileName}`);
  } catch (err) {
    console.error(`Error appending to file: ${err}`);
    throw err;
  }
} 

module.exports = { appendToFile, logClient };
