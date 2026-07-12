const express = require("express");
const app = express();
const path = require("path");
const Listing = require("./models/listing.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const mongoose = require("mongoose");

const MONGO_URL = 'mongodb://127.0.0.1:27017/BookingRaj';
main() 
.then(() => {console.log("Connected to Database")})
.catch((err) => {console.log(err)});

async function main(){
    mongoose.connect(MONGO_URL);
}


app.get("/", (req,res)=>{
    res.send("Hi i am root");
})

app.get("/listings", async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("index.ejs",{allListings});
})


//post(add) new listings
app.get("/listings/add", (req,res)=>{
    res.render("addListing");
})

app.post("/listings", async (req,res)=>{
    let {title,description,image,price,location,country} = req.body;
    let newLisitng = new Listing({
        title : title,
        description : description,
        image : image,
        price : price,
        location : location,
        country : country,
    });

    await newLisitng.save();
    res.send("data saved");
})


//update part
app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    console.log(id)
    let listing = await Listing.find({_id : id});
    console.log(listing);
    res.send("worked")
});

app.patch("/listings/:id", (req,res)=>{
    let {id} = req.params;
    // Listing.findByIdAndUpdate("")

});


//delete part
app.delete("/listings/:id",(req,res)=>{
    let {id} = req.params;
    Listing.findByIdAndDelete(id);
    res.redirect("/");
})






















app.listen(8080, ()=>{
    console.log("Server is listening in port 8080");
})
