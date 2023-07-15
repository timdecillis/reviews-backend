const fs = require('fs');
const path = require('path');
const { Pool, Client } = require('pg');
const { dbConfig } = require('../config.js');

const pool = new Pool(dbConfig);

module.exports = {
  getReviews: async (product, page, count, sort) => {
    page = (page - 1) * count;
    if (sort === 'relevant' || sort === 'helpful') {
      try {
        const query =
          `SELECT * FROM reviews WHERE product_id = ${product} ORDER BY helpfulness DESC LIMIT ${count} OFFSET ${page}`;
        const result = await pool.query(query);
        return result.rows;
      } catch (error) {
        console.error('Error querying table:', error);
      }
    } else if (sort === 'newest') {
      try {
        const query =
          `SELECT * FROM reviews WHERE product_id = ${product} LIMIT ${count} OFFSET ${page}`;
        const result = await pool.query(query);
        return result.rows;
      } catch (error) {
        console.error('Error querying table:', error);
      }
    }
  },

  getReviewMeta: async (product) => {

    let metaData = {
      ratings: {
        '1.00': 0,
        '2.00': 0,
        '3.00': 0,
        '4.00': 0,
        '5.00': 0
      },
      recommend: {
        true: 0,
        false: 0
      },
      characteristics: {}
    };

    try {
      const ratingsQuery = await pool.query(`SELECT * FROM reviews WHERE product_id = ${product}`);
      ratingsQuery.rows.forEach((review) => {
        metaData.ratings[review.rating] ++;
      });
      const recommendedYesQuery = await pool.query(`SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND Recommend = true`);
      metaData.recommend.true = recommendedYesQuery.rows[0].count;
      const recommendedNoQuery = await pool.query(`SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND Recommend = false`);
      metaData.recommend.false = recommendedNoQuery.rows[0].count;
      const characteristicsQuery = await pool.query(`SELECT * FROM characteristics WHERE product_id = ${product}`);
      characteristicsQuery.rows.forEach((char) => {
        metaData.characteristics[char.name] = 0;
      });
      // const charValuesQuery = await pool.query(`SELECT * FROM characteristics_values WHERE product_id = ${product}`);
      return metaData;
    } catch (error) {
      console.error('Error querying table:', error);
    }
  },
  getReview: async (review) => {
    try {
      const getQuery = await pool.query(`SELECT * FROM reviews WHERE id = ${review}`);
      return getQuery.rows[0];
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  },
  addHelpful: async (review) => {
    try {
      const helpfulQuery = await pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review}`);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  },
};