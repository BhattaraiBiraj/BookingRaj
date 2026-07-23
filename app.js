const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


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


app.use("/listings", listing);
app.use("/listings/:id/reviews", review);


app.all("/*splat", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    let {status = 500,message = "something went erong"} = err;
    res.status(status).render("error.ejs",{message});
})


app.listen(8080, ()=>{
    console.log("Server is listening in port 8080");
})
