const mongoose = require("mongoose");
const Review = require("./review.js");

const Schema = {
    title : {
        type : String, 
        required : true
    },
    description : {
        type : String, 
        required : true
    },
    image : {
        url : String,
        filename : String
        },
  price : Number,
  location : String,
  country : String,
  reviews : [{
                type : mongoose.Schema.Types.ObjectId,
                ref : "Review",
             }],
    owner  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
}

const ListingSchema = new mongoose.Schema(Schema);

ListingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = mongoose.model("Listing", ListingSchema);


module.exports = Listing;