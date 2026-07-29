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
        type : String,
        default : "https:/encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCBacBAmsH6NoiO0-otYwzP7D8dV1-LnMiqZDWXkZvBw&s=10", 
        set : (v) => 
            v == ""?
            "https:/encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCBacBAmsH6NoiO0-otYwzP7D8dV1-LnMiqZDWXkZvBw&s=10" 
            : v
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