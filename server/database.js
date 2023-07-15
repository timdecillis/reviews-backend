const fs = require('fs');
const path = require('path');
const { Pool, Client } = require('pg');
const { dbConfig } = require('../config.js');

const client = new Client(dbConfig);

module.exports = {
  getReviews: async (product, page, count, sort) => {
    console.log('product', product)
    try {
      await client.connect();
      console.log('Connected to the database.');
      const query =
      `SELECT * FROM reviews WHERE product_id = ${product} LIMIT ${count};`;
      const result = await client.query(query);
      console.log(`Querying database.`);
      await console.log('ROWS', result)
      // return result.rows;
    } catch (error) {
      console.error('Error querying table:', error);
    } finally {
      await client.end();
      console.log('Disconnected from the database.');
    }

    //query the database, using the params to refine
  },
  getReviewMeta: (product) => {
    // query the reviews table and the characteristics_values table using the product id,
    // performing logic to count the total of each star review and the helpfulness, and
    // add the characteristics_values
  },
  addReview: (product) => {
    // add the review to the db, using the product id as a reference
  },
  addHelpful: (review) => {
    // increment the helpful count for the specified review
  },
};