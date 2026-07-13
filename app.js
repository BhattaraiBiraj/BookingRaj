const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override"); 
const Listing = require("./models/listing.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method"));

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

//index route
app.get("/listings", async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});


//post(add) new listings
app.get("/listings/add", (req,res)=>{
    console.log("huhuhuhuhuhuhuhuhuhuhuhu")
    res.render("listings/addListing.ejs");
})

app.post("/listings", async (req,res)=>{
    const {title,description,image,price,location,country} = req.body;
    const  newLisitng = new Listing({
        title : title,
        description : description,
        image : image,
        price : price,
        location : location,
        country : country,
    });

    await newLisitng.save();
    res.redirect("/listings");
})

//show
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id);
   console.log(listing);
    res.render("listings/show.ejs",{listing});
})

//update part
app.get("/listings/:id/edit", async (req,res)=>{
    const {id} = req.params;
    console.log(id)
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let {title, description, image, price, location,country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    res.redirect("/listings");
});


//delete part
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})


app.listen(8080, ()=>{
    console.log("Server is listening in port 8080");
})
