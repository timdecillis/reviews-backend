const express = require('express');
const app = express();
const db = require('./database.js');
const router = require('express').Router();
const morgan = require('morgan');
const {getReviews, getReviewMeta, addReview, addHelpful} = require('./database');

app.use(morgan('common'));
app.use(express.json());
app.use('/reviews', router);

router.get('/', (req, res)=> {
  var {product_id, sort, count, page} = req.query
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

// router.get('/?product_id', ({product_id} = req.params, res)=> {
//   getReviews()
//     .then((reviews) => {
//       res.status(200).send(product_id);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

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

