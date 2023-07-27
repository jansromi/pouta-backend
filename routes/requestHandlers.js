const fs = require('fs');
const path = require('path');
const os = require('os');
const { generateTimestamp } = require('../libs/date.js');
const { appendToFile } = require('../logger/logger.js');


function saveWeatherData(req, res) {
  // Now the body is already parsed as JSON
  let body = req.body;

  // Get a timestamp and format it as yyyy-mm-dd-hh-mm-ss
  let date = new Date();
  let timestamp = generateTimestamp(date);

  // Create filename with timestamp
  let filename = `pouta-weatherdata/pouta-iot-data-${timestamp}.txt`;

  // Convert the filename to absolute path
  let absolutePath = path.join(os.homedir(), filename);

  // Convert body back to a string to append to file
  let bodyString = JSON.stringify(body);

  appendToFile(absolutePath, bodyString);
}

module.exports = { saveWeatherData };
