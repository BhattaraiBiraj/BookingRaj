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

router
.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,validateListing,wrapAsync(ListingController.createListing))

//post(add) new listings
router.get("/new",isLoggedIn,ListingController.renderNewForm)

router
.route("/:id")
.get(wrapAsync(ListingController.showListings))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,wrapAsync(ListingController.destroyListing));


//update part
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm));

module.exports = router;