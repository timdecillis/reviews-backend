const fs = require('fs');
const path = require('path');
const { Pool, Client } = require('pg');
const { dbConfig } = require('../config.js');

const pool = new Pool(dbConfig);

module.exports = {
  getReviews: async (product, page, count, sort) => {
    page = (page - 1) * count;
    if ((sort === 'helpful') || (sort === 'relevant')) {
      sort = 'helpfulness';
    }
    if (sort === 'newest') {
      sort = 'date';
    }

    try {
      const query =
        `SELECT * FROM reviews WHERE product_id = ${product} ORDER BY ${sort} DESC LIMIT ${count} OFFSET ${page}`;
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
  },

  getReviewMeta: async (product) => {
    try {
      const query = await pool.query(`
        SELECT
          json_object_agg(CAST(rating AS INTEGER), count) AS ratings
        FROM (
          SELECT
            rating::integer,
            COUNT(*)::text AS count
          FROM reviews AS r
          WHERE r.product_id = ${product}
          GROUP BY rating
          ORDER BY rating ASC
        ) AS subquery;

        SELECT
          json_object_agg(recommend, count) AS recommended
        FROM (
          SELECT
            recommend,
            COUNT(*)::text AS count
          FROM reviews AS r
          WHERE r.product_id = ${product}
          GROUP BY recommend
        ) AS subquery;

        SELECT
          json_object_agg(name, json_build_object('id', characteristic_id, 'value', average)) AS characteristics
        FROM (
          SELECT
            c.name,
            c.id AS characteristic_id,
            AVG(cv.value)::text AS average
          FROM characteristics AS c
          JOIN characteristic_values AS cv ON c.id = cv.characteristic_id
          WHERE c.product_id = ${product}
          GROUP BY c.name, c.id
        ) AS subquery;
      `);

      const ratingQueryResult = query[0].rows[0];
      const ratings = ratingQueryResult.ratings || {};
      const recommendedQueryResult = query[1].rows[0];
      const recommended = recommendedQueryResult.recommended || {};
      const characteristicsQueryResult = query[2].rows[0];
      const characteristics = characteristicsQueryResult.characteristics || {};

      const metaData = {
        product_id: product,
        ratings,
        recommended,
        characteristics
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