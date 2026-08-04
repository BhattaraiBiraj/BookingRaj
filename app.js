require('dotenv').config()

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/BookingRaj';
main() 
.then(() => {console.log("Connected to Database")})
.catch((err) => {console.log(err)});

async function main(){
    mongoose.connect(MONGO_URL);
}


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret : "mysecretcode", 
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000 * 60 *60 * 24 * 3,
        maxAge : 1000 * 60 *60 * 24 * 3,
        httpOnly : true,
    },
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currentUser = req.user;
    next();
})




// All Routes 

app.get("/", (req,res)=>{
    res.send("Hi i am root");
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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
