require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.connect((err) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
});

// This function fetches the latest 50 weather rows
async function getLatestWeatherRows() {
  const query = `
    SELECT
      w.value as temperature,
      (SELECT w2.value FROM weather_data w2 WHERE w2.sensor_id = 2 AND w2.timestamp <= w.timestamp ORDER BY w2.timestamp DESC LIMIT 1) as humidity,
      l.street as location,
      w.timestamp as time
    FROM
      weather_data w
      INNER JOIN sensor s ON w.sensor_id = s.id
      INNER JOIN location l ON w.location_id = l.id
    WHERE
      s.sensor_type = 'Temperature'
    ORDER BY
      w.timestamp DESC
    LIMIT 50
  `;

  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
}

async function insertWeatherData(data) {
    if (data.Valid && data.User === 'Jansromi_Testi') {
        const locationId = 2; // static location id
        const sensorIdMap = {
            'Temperature': 1,
            'Humidity': 2,
        };
        
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const insertWeatherQuery = `
                INSERT INTO weather_data(location_id, sensor_id, timestamp, value) 
                VALUES($1, $2, NOW(), $3);
            `;

            for (let key in data) {
                if (sensorIdMap[key]) {
                    await client.query(insertWeatherQuery, [locationId, sensorIdMap[key], data[key]]);
                }
            }

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } else {
        console.log("Invalid data or user");
    }
}


module.exports = {
  getLatestWeatherRows, insertWeatherData
}

