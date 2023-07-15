const fs = require('fs');
const path = require('path');
const { Pool, Client } = require('pg');
const { dbConfig } = require('../config.js');

const pool = new Pool(dbConfig);

module.exports = {
  getReviews: async (product, page, count, sort) => {
    try {
      const query =
      `SELECT * FROM reviews WHERE product_id = ${product} LIMIT ${count};`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error querying table:', error);
    } finally {
      console.log('Disconnected from the database.');
    }
  },
  getReviewMeta: async (product) => {
    try {
      const query =
      `SELECT COUNT(*) FROM reviews WHERE rating = '3' LIMIT 5;`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error querying table:', error);
    } finally {
      console.log('Disconnected from the database.');
    }
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