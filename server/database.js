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

        const reviewIds = result.rows.map((row) => row.id);
        const photosQuery = await pool.query(`
          SELECT * FROM reviews_photos WHERE review_id IN (${reviewIds.join(',')})
        `);
        const photosByReviewId = photosQuery.rows.reduce((acc, photo) => {
          if (!acc[photo.review_id]) {
            acc[photo.review_id] = [];
          }
          acc[photo.review_id].push({
            id: photo.id,
            url: photo.url
          });
          return acc;
        }, {});

        return {
          product: product,
          page: Math.ceil((page + 1) / count),
          count: parseInt(count),
          results: result.rows.map((row) => {
            const photos = photosByReviewId[row.id] || [];
            return {
              review_id: row.id,
              rating: Math.floor(parseInt(row.rating)),
              summary: row.summary,
              recommend: row.recommend,
              response: row.response,
              body: row.body,
              date: new Date(Number(row.date)).toISOString(),
              reviewer_name: row.name,
              helpfulness: row.helpfulness,
              photos: photos
            };
          })
        };
      } catch (error) {
        console.error('Error querying table:', error);
      }
    } else if (sort === 'newest') {
      try {
        const query =
          `SELECT * FROM reviews WHERE product_id = ${product} ORDER BY date DESC LIMIT ${count} OFFSET ${page}`;
        const result = await pool.query(query);

        const reviewIds = result.rows.map((row) => row.id);
        const photosQuery = await pool.query(`
          SELECT * FROM reviews_photos WHERE review_id IN (${reviewIds.join(',')})
        `);
        const photosByReviewId = photosQuery.rows.reduce((acc, photo) => {
          if (!acc[photo.review_id]) {
            acc[photo.review_id] = [];
          }
          acc[photo.review_id].push({
            id: photo.id,
            url: photo.url
          });
          return acc;
        }, {});

        return {
          product: product,
          page: Math.ceil((page + 1) / count),
          count: parseInt(count),
          results: result.rows.map((row) => {
            const photos = photosByReviewId[row.id] || [];
            return {
              review_id: row.id,
              rating: Math.floor(parseInt(row.rating)),
              summary: row.summary,
              recommend: row.recommend,
              response: row.response,
              body: row.body,
              date: new Date(Number(row.date)).toISOString(),
              reviewer_name: row.name,
              helpfulness: row.helpfulness,
              photos: photos
            };
          })
        };
      } catch (error) {
        console.error('Error querying table:', error);
      }
    }
  },

  getReviewMeta: async (product) => {

    let metaData = {
      product_id: product,
      ratings: {
        '1.00': '0',
        '2.00': '0',
        '3.00': '0',
        '4.00': '0',
        '5.00': '0'
      },
      recommended: {
        true: 0,
        false: 0
      },
      characteristics: {}
    };

    charIds = [];

    try {
      const ratingsQuery = await pool.query(`
      SELECT rating, COUNT(*) AS count
      FROM reviews
      WHERE product_id = ${product}
      GROUP BY rating
    `);
      ratingsQuery.rows.forEach((row) => {
        let rating = row.rating.toString();
        metaData.ratings[rating] = row.count.toString();
      });

      const recommendedYesQuery = await pool.query(`SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND Recommend = true`);
      metaData.recommended.true = recommendedYesQuery.rows[0].count;
      const recommendedNoQuery = await pool.query(`SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND Recommend = false`);
      metaData.recommended.false = recommendedNoQuery.rows[0].count;
      const characteristicsQuery = await pool.query(`SELECT c.name, cv.characteristic_id, AVG(cv.value) AS average
      FROM characteristics AS c
      JOIN characteristic_values AS cv ON c.id = cv.characteristic_id
      WHERE c.product_id = ${product}
      GROUP BY c.name, cv.characteristic_id`);

      characteristicsQuery.rows.forEach((char) => {
        metaData.characteristics[char.name] = {
          id: char.characteristic_id,
          value: char.average
        };
      });

      return metaData;
    } catch (error) {
      console.error('Error querying table:', error);
    }
  },
  addReview: async (review) => {
    let {product_id, rating, summary, body, recommend, name, email, photos, characteristics} = review;
    try {
      await pool.query(`INSERT INTO reviews VALUES(${product_id}, ${rating}, CURRENT_TIMESTAMP, '${summary}', '${body}', ${recommend}, false, '${name}', '${email}', null, null)`);

    } catch (err) {
      console.error('Error submitting review:', err);
    }
  },

  addHelpful: async (review) => {
    try {
      const helpfulQuery = await pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review}`);
    } catch (error) {
      console.error('Error updating entry:', error);
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
};