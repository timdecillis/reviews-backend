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
    try {
      const query = await pool.query(`
        SELECT
          rating::text,
          COUNT(*)::text AS count
        FROM reviews AS r
        WHERE r.product_id = ${product}
        GROUP BY rating
        ORDER BY rating ASC;
      `);

      const ratingRows = query.rows;
      const ratings = {};
      ratingRows.forEach((row) => {
        const rating = row.rating;
        ratings[rating] = row.count;
      });

      const recommendedQuery = await pool.query(`
        SELECT
          recommend,
          COUNT(*)::text AS count
        FROM reviews AS r
        WHERE r.product_id = ${product}
        GROUP BY recommend;
      `);

      const recommendedRows = recommendedQuery.rows;
      const recommended = {};
      recommendedRows.forEach((row) => {
        const recommendValue = row.recommend;
        recommended[recommendValue] = row.count;
      });

      const characteristicsQuery = await pool.query(`
        SELECT
          c.name,
          c.id AS characteristic_id,
          AVG(cv.value)::text AS average
        FROM characteristics AS c
        JOIN characteristic_values AS cv ON c.id = cv.characteristic_id
        WHERE c.product_id = ${product}
        GROUP BY c.name, c.id;
      `);

      const characteristicsRows = characteristicsQuery.rows;
      const characteristics = {};
      characteristicsRows.forEach((row) => {
        const name = row.name;
        const characteristicId = row.characteristic_id;
        const average = row.average;
        characteristics[name] = {
          id: characteristicId,
          value: average
        };
      });

      const metaData = {
        product_id: product,
        ratings: ratings,
        recommended: recommended,
        characteristics: characteristics
      };

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