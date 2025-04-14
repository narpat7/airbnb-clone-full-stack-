const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
      image: {
      type: {
        url: String,
        filename: String
      },
      default: {
        url: "https://unsplash.com/photos/snow-capped-mountains-peak-against-a-colorful-sunset-NLiKKKr3IbU",
        filename: "defaultimage"
      }
    }
  });
  

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
