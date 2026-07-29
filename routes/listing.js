const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedIn,isOwner} = require("../middleware.js");

const ListingController = require("../controllers/listing.js")

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
router.get("/", wrapAsync(ListingController.index));

//post(add) new listings
router.get("/new",isLoggedIn,ListingController.renderNewForm)

router.post("/",isLoggedIn,validateListing,wrapAsync(ListingController.createListing))

//show
router.get("/:id",wrapAsync(ListingController.showListings));

//update part
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm));

router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(ListingController.updateListing));
 

//delete part
router.delete("/:id",isLoggedIn,wrapAsync(ListingController.destroyListing));


module.exports = router;