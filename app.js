const express = require("express");
const app = express();
const path = require("path");
const Listing = require("./models/listing.js");


app.set()
const mongoose = require("mongoose");

const MONGO_URL = 'mongodb://127.0.0.1:27017/BookingRaj';
main() 
.then(() => {console.log("Connected to Database")})
.catch((err) => {console.log(err)});

async function main(){
    mongoose.connect(MONGO_URL);
}


app.get("/testlist", async (req,res) =>{
    const sampleListing = new Listing({
            title: "Luxury My Villa",
            description : "Beside the beach",
            price : 3000,
            location : "Dalal Street, Bombay",
            country : "India",
    });
    await sampleListing.save();
    console.log("The data is saved");
    res.send("Successful");

})

app.get("/", (req,res)=>{
    res.send("Hi i am root");
})
























app.listen(8080, ()=>{
    console.log("Server is listening in port 8080");
})
