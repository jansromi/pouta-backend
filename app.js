const express = require('express');
const { logClient, processPostRequest } = require('./routes/requestHandlers.js');
const { getLatestWeatherRows, insertWeatherData } = require('./db/db.js');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../pouta-frontend/dynahtml')));


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
  logClient(req);
  console.log(req.body);
  processPostRequest(req, res);
  try {
    await insertWeatherData(req.body);
    res.status(200).send('Data inserted successfully');
  } catch (err) {
    res.status(500).send('Server error');
    console.error(err);
    }
});

app.get('/', (req, res) => {
  logClient(req);
  res.sendFile(path.join(__dirname, '../pouta-frontend/dynahtml/index.html'));
});

app.listen(PORT, () => {
  console.log("Server is running at port 3000...");
});

