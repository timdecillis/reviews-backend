const ratingsAndReviewsSchema = new mongoose.Schema({
  reviews: [{
    id: {type: Number, unique: true},
    date: String,
    name: String,
    rating: Number,
    recommend: Boolean,
    summary: String,
    body: String,
    response: String,
    helpfulYes: Number,
    helpfulNo: Number,
    photos: [],
    email: String,
  }],
  ratings: {
    total5: Number,
    total4: Number,
    total3: Number,
    total2: Number,
    total1: Number
  }
  characteristics: [{
    Size: Number,
    Quality: Number,
    Comfort: Number,
    Quality: Number
  }]
  recommend: {
    yes: Number,
    no: Number
  }
});