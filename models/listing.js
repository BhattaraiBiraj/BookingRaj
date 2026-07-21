const mongoose = require("mongoose");

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
  reviews : {
    type : Schema.Types.ObjectId,

  }
}

const ListingSchema = new mongoose.Schema(Schema);
const Listing = mongoose.model("Listing", ListingSchema);


module.exports = Listing;