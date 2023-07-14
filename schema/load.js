const fs = require('fs');
const path = require('path');
const { Pool, Client } = require('pg');
const { host, user, pw, db, port } = require('../config.js');

// inputfile & target table
const dbConfig = {
  host: host,
  user: user,
  pw: pw,
  database: db,
  port: port
};

const paths = {
  schema: path.join(__dirname, '/createTables.sql'),
  chars: path.join(__dirname, '/data/characteristics.csv'),
  charsValues: path.join(__dirname, '/data/characteristic_reviews.csv'),
  reviews: path.join(__dirname, '/data/reviews.csv'),
  reviews_photos: path.join(__dirname, '/data/reviews_photos.csv')
};

const queries = {
  createTables: fs.readFileSync(paths.schema, 'utf-8'),
  chars: `COPY characteristics FROM '${paths.chars}' DELIMITER ',' CSV HEADER;`,
  charsValues: `COPY characteristic_values FROM '${paths.charsValues}' DELIMITER ',' CSV HEADER;`,
  reviews: `COPY reviews FROM '${paths.reviews}' DELIMITER ',' CSV HEADER;`,
  reviews_photos: `COPY reviews_photos FROM '${paths.reviews_photos}' DELIMITER ',' CSV HEADER;`
};

const createTables = async () =>{
  const client = new Client(dbConfig);

  try {

    await client.connect();
    console.log('Connected to the database.');

    await client.query(queries.createTables);
    console.log(`Tables created successfully.`);

    await client.query(queries.chars);
    await client.query(queries.reviews);
    await client.query(queries.reviews_photos);
    await client.query(queries.charsValues);
  } catch (error) {

    await client.query('ROLLBACK');
    console.error('Error creating table:', error);
  } finally {

    await client.end();
    console.log('Disconnected from the database.');
  }
}

createTables();
