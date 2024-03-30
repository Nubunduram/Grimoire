const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String },
      grade: { type: Number }
    }
  ],
  averageRating: { type: Number, default: 0 }
})

// Before Adding Book or Modificating Book
bookSchema.pre('save', function(next) {
  // if a new rating is added
  if (this.isModified('ratings')) {
    let sumOfRatings = 0;

    // get sum of all ratings in the array
    for (const rating of this.ratings) {
      sumOfRatings += rating.grade;
    }

    // divide it by max length to get the new average rating
    this.averageRating = Math.round(sumOfRatings / this.ratings.length);
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema)