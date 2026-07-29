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


module.exports = {isLoggedIn, saveRedirectUrl};