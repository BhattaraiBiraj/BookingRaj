const Listing = require("./models/listing.js");


const isLoggedIn = (req,res,next) =>{
 if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must logged in to add new listing")
       res.redirect("/login");
    }else{
        next();
    }
};


const saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "you dont have permission to do action");
        return res.redirect(`listings/${id}`);
    }
    next();
}
module.exports = {isLoggedIn, saveRedirectUrl,isOwner};