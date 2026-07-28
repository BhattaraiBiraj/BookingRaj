const express = require("express");
const router = express.Router();

const User = require("../models/user.js");


router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", async (req,res)=>{
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
});



module.exports = router;