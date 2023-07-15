const express = require('express');
const app = express();
const db = require('./database.js');
const router = require('express').Router();
const morgan = require('morgan');
const {getReviews, getReviewMeta, addReview, addHelpful, getReview} = require('./database');

app.use(morgan('dev'));
app.use(express.json());
app.use('/reviews', router);

router.get('/', (req, res)=> {
  // eslint-disable-next-line camelcase
  let {product_id, sort, count, page} = req.query;
  page = page || 1;
  count = count || 5;
  sort = sort || 'relevant';
  getReviews(product_id, page, count, sort)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/meta', (req, res) => {
  // eslint-disable-next-line camelcase
  let {product_id} = req.query;
  getReviewMeta(product_id)
    .then((metaData) => {
      res.status(200).send(metaData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/:review_id', (req, res) => {
  let {review_id} = req.params;
  addReview(review)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put('/:review_id/helpful', (req, res) => {
  let {review_id} = req.params;
  addHelpful(review_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/:review_id/', (req, res) => {
  let {review_id} = req.params;
  getReview(review_id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      console.log(err);
    });
});

let port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

