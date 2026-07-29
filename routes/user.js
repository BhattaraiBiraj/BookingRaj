const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const {isLoggedIn,saveRedirectUrl} = require("../middleware.js");
const UserController = require("../controllers/user.js");

router.get("/signup", UserController.renderSignupForm);

router.post("/signup", WrapAsync(UserController.signup));

router.get("/login",UserController.renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local", {failureRedirect : "/login",failureFlash : true}), UserController.login);

//logout
router.get('/logout',UserController.logout)


module.exports = router;