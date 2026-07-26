const express = require("express");
const router = express.Router({mergeParams : true});

const {listingSchema, reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

//reviews
router.post("/", validateReview, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const {rating,comment} = req.body;
    const listing = await Listing.findById(id);

    const newReview = await Review({rating,comment});
    newReview.save();

    await listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${id}`)
}));

router.delete("/:reviewId",wrapAsync( async (req, res)=>{
    const {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;