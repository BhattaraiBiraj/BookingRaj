const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/addListing.ejs");
}

module.exports.createListing = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    })
  .send();

    const url = req.file.path;
    const filename = req.file.filename;
    console.log(url,filename)
    const {title,description,price,location,country} = req.body;
    const  newLisitng = new Listing({
        title : title,
        description : description,
        image : {
            url,
            filename
        },
        price : price,
        location : location, 
        country : country,
        owner : req.user._id,
        geometry : response.body.features[0].geometry
        });
   let savedListing = await newLisitng.save();
   console.log(savedListing)
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
    const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error", "This listing you try to get doesn't exist");
    return res.redirect("/listings");
   }
   
   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_200");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing =  async (req,res)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    })
  .send()
   
    let {id} = req.params;
    let {title, description, price, location,country} = req.body;
    const listing = await Listing.findByIdAndUpdate(id, {title, description, price, location, country,geometry : response.body.features[0].geometry});
   
   if(typeof req.file !== "undefined"){
     const url = req.file.path;
    const filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
   } 
    req.flash("success", "Successfully Updated !");
    res.redirect("/listings");
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
}

