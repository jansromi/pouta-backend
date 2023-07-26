const fs = require('fs').promises;

async function appendToFile(fileName, data) {
  try {
    await fs.appendFile(fileName, data + '\n');
    console.log(`Data appended to ${fileName}`);
  } catch (err) {
    console.error(`Error appending to file: ${err}`);
    throw err;
  }
}

function sendResponse(res, statusCode, message) {
  //res.status(statusCode).send(message);
}

module.exports = { appendToFile, sendResponse };
