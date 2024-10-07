const express = require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing= require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
// .. dilam karon listing.js route name folder a a6ha ar app.ja baira a6ha tai all path different tai .. dita hoba mana parent directory modha ja6hi
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


//Index Route and //Create Route
router.route("/")
.get(wrapAsync(listingController.index))
 .post(
     isLoggedIn,
     upload.single("listing[image]"), //multer middleware upload image to server side
     validateListing,
     wrapAsync(listingController.createListing)
 );


//New Route
router.get("/new",isLoggedIn,listingController.renderNewFrom);

//Show Route and//Update Route and //Delete Route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;