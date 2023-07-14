const express = require('express');
const app = express();
const db = require('./database.js');
const router = require('express').Router();
const {getReviews, getReviewMeta, addReview, addHelpful} = require('./database');

app.use(express.json());
app.use('/reviews', router);

router.get('/:product_id', ({product_id} = req.params, res)=> {
  getReviews()
    .then((reviews) => {
      res.status(200).send(product_id);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/meta', (req, res) => {
  getReviewMeta()
    .then((metaData) => {
      res.status(200).send(metaData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/', (req, res) => {
  addReview(req)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put('/', (req, res) => {
  addHelpful()
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log(err);
    });
});

let port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

