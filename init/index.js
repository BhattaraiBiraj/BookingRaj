const mongoose = require("mongoose");

const  initialData = require("./data.js");

const Listing =  require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/BookingRaj';


main() 
.then(() => {console.log("Connected to Database")})
.catch((err) => {console.log(err)});

async function main(){
    await mongoose.connect(MONGO_URL);
};

async function ListData(){
    await Listing.deleteMany({});
    initialData.data = initialData.data.map((obj)=>({...obj, owner : '6a688eb7d2a5ff4ed3c69192'}));
    console.log(initialData.data)
    await Listing.insertMany(initialData.data);
}

ListData();




