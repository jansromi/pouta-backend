const express = require('express');
const { saveWeatherData } = require('./routes/requestHandlers.js');
const { logClient, logPost } = require('./logger/logger.js');
const { getLatestWeatherRows, insertWeatherData } = require('./db/db.js');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../pouta-frontend/dynahtml/static')));
app.use(cors());

app.set('trust proxy', 'loopback');

app.get('/', (req, res) => {
  logClient(req);
  res.sendFile(path.join(__dirname, '../pouta-frontend/dynahtml/index.html'));
});

app.post('/', (req, res) => {
  logClient(req);
  res.send("Hello!\n")
});

app.get('/api/get/', async (req, res) => {
  logClient(req);

  try {
    const data = await getLatestWeatherRows();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server error');
  console.error(err);
  }
});

app.post('/api/post/', async (req, res) => {
  logPost(req);
  console.log(req.body);
  saveWeatherData(req, res);
  try {
    await insertWeatherData(req.body);
    res.status(200).send('Data inserted successfully');
  } catch (err) {
    res.status(500).send('Server error');
    console.error(err);
    }
});

app.listen(PORT, () => {
  console.log("Server is running at port 3000...");
});

