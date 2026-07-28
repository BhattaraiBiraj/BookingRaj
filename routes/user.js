const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", WrapAsync(async (req,res)=>{
    try{
         let {username, email, password} = req.body;
        const user1 = new User({username, email});
        const a = await User.register(user1, password);
        console.log(a);
        req.flash("success","Welcome to BookingRaj");
        res.redirect("/listings");
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local", {failureRedirect : "/login",failureFlash : true}), (req,res)=>{
    req.flash('success', 'Welcome back to BookingRaj')
    res.redirect("listings");
});


module.exports = router;