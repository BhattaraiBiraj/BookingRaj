const express = require("express");
const router = express.Router({mergeParams : true});
const ReviewController = require("../controllers/review.js");

const {listingSchema, reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const {isLoggedIn,isOwner} = require("../middleware.js");

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
router.post("/",isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));

router.delete("/:reviewId",isLoggedIn,wrapAsync(ReviewController.destroyReview));

module.exports = router;