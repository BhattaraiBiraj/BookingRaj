const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

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
app.get("/listings", wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//post(add) new listings
app.get("/listings/new", (req,res)=>{
    res.render("listings/addListing.ejs");
})

app.post("/listings",wrapAsync( async (req,res,next)=>{
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
}))

//show
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id);
   console.log(listing);
    res.render("listings/show.ejs",{listing});
}));

//update part
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    const {id} = req.params;
    console.log(id)
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

app.put("/listings/:id",wrapAsync( async (req,res)=>{
    let {id} = req.params;
    let {title, description, image, price, location,country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    res.redirect("/listings");
}));


//delete part
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("/*splat", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    console.log("euta aao")
    let {status = 500,message = "something went erong"} = err;
    res.send(status).render("error.ejs",{message});
})


app.listen(8080, ()=>{
    console.log("Server is listening in port 8080");
})
