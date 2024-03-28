const mongoose = require("mongoose");
const Listing = require("../models/Listing");

const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware to populate user details in queries
reviewSchema.pre(/^find/, function(next){
  this.populate({
    path:'user',
    select:'firstName lastName profileImagePath'
  });
  next();
});

// Static method to calculate average ratings
reviewSchema.statics.calculateAverageRatings = async function (id) {
  try {
    const stats = await this.aggregate([
      {
        $match: { listing: id }
      },
      {
        $group: {
          _id: 'listing',
          numOfRating: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    if (stats.length > 0) {
      const { numOfRating, avgRating } = stats[0];

      const listing = await Listing.findById(id); // Retrieve listing
      if (!listing) {
        throw new Error('Listing not found'); // Handle if listing is not found
      }

      listing.totalRating = numOfRating;
      listing.averageRating = avgRating;
      await listing.save(); // Save the updated listing

      console.log('Listing data updated successfully.');
    } else {
      console.log('No reviews found for the listing with ID: ' + id);
    }
  } catch (error) {
    console.error('Error while calculating and updating ratings:', error);
  }
};

// Post-save hook to update listing's reviews array with review ID
reviewSchema.post('save', async function() {
  try {
    const listing = await Listing.findById(this.listing); // Retrieve listing
    if (!listing) {
      throw new Error('Listing not found'); // Handle if listing is not found
    }

    listing.reviews.push(this._id); // Push review ID to reviews array
    await listing.save(); // Save the updated listing

    console.log('Review ID added to listing reviews array.');

    // Recalculate and update average ratings for the listing
    this.constructor.calculateAverageRatings(this.listing);
  } catch (error) {
    console.error('Error while updating listing reviews array:', error);
  }
});

const ReviewModel = mongoose.model("Review", reviewSchema);
module.exports = { ReviewModel };
