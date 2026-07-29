const Listing = require("../models/listing");


module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/addListing.ejs");
}

module.exports.createListing = async (req,res,next)=>{
        const {title,description,image,price,location,country} = req.body;
        const  newLisitng = new Listing({
        title : title,
        description : description,
        image : image,
        price : price,
        location : location, 
        country : country,
        owner : req.user._id
        });
    await newLisitng.save();
    req.flash("success", "New Listing created Successfully");
    res.redirect("/listings");
}

module.exports.showListings = async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate({
   path : "reviews",
   populate : {
    path : "author"
   }
   });
   console.log(listing)
   if(!listing){
    req.flash("error", "This listing you try to get doesn't exist");
    return res.redirect("/listings");
   }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    console.log(id)
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing =  async (req,res)=>{
    let {id} = req.params;
    let {title, description, image, price, location,country} = req.body;
    await Listing.findByIdAndUpdate(id, {title, description, image, price, location, country});
    req.flash("success", "Successfully Updated !");
    res.redirect("/listings");
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
}

