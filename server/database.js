module.exports = {
  getReviews: (product, params) => {
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