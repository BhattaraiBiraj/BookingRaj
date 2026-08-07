const Fuse = require("fuse.js");

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

router.get("/search", async (req,res)=>{
    let { q } = req.query;

    if (!q || q.trim() === "") {
        req.flash("error", "Please enter a city name to search");
        return res.redirect("/listings");
    }

    const allListingData = await Listing.find({});

    const fuse = new Fuse(allListingData, {
        keys : ["location", "country"],
        threshold: 0.4,
    });

    const results = fuse.search(q);
    const allListings = results.map( result => result.item);

    res.render("listings/index.ejs",{allListings , searchQuery: q});
})

module.exports = router;