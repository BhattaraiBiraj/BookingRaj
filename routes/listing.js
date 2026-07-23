const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}


//index
router.get("/", wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//post(add) new listings
router.get("/new", (req,res)=>{
    res.render("listings/addListing.ejs");
})

router.post("/",validateListing,wrapAsync( async (req,res,next)=>{
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
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");
   console.log(listing)
    res.render("listings/show.ejs",{listing});
}));

//update part
router.get("/:id/edit", wrapAsync(async (req,res)=>{
    const {id} = req.params;
    console.log(id)
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

router.put("/:id",validateListing,wrapAsync( async (req,res)=>{
    let {id} = req.params;
    let {title, description, image, price, location,country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    res.redirect("/listings");
}));
 

//delete part
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports = router;