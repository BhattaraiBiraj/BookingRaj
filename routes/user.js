const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const {isLoggedIn,saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", WrapAsync(async (req,res)=>{
    try{
         let {username, email, password} = req.body;
        const user1 = new User({username, email});
        const registeredUser = await User.register(user1, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
                req.flash("success","Welcome to BookingRaj");
                res.redirect("/listings");  
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local", {failureRedirect : "/login",failureFlash : true}), (req,res)=>{
    req.flash('success', 'Welcome back to BookingRaj');
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }
    else{
        return res.redirect("/listings")
    }
});

//logout
router.get('/logout', (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings")
    })
})


module.exports = router;