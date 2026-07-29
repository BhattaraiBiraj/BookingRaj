const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=>{
    const {id} = req.params;
    const {rating,comment} = req.body;
    const listing = await Listing.findById(id);

    const newReview = await Review({rating,comment});
    newReview.author = res.locals.currentUser._id;
    newReview.save();

    await listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${id}`)
}


module.exports.destroyReview = async (req, res)=>{
    const {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`);
}
