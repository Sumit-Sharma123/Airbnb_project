const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/WrapAsync.js");
const Listing = require("../MODELS/Listing.js");
const { isLoggedIn , isOwner , validatelisting} = require("../middleware.js");
const listingController = require("../Controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


//validation for Schema(Middleware)

//router.route = it optimize and compact because it combines the same Path/Route.

router.route("/")
.get(wrapAsync(listingController.index))       //index route 
.post(isLoggedIn , upload.single('listing[image]'),  validatelisting,
 wrapAsync( listingController.createListing ));  //Create Route 


//New Route
router.get("/new" ,isLoggedIn,listingController.renderNewForm );

router.route("/:id")
.router.get( wrapAsync( listingController.showListing))   //Show Route 
.put( isLoggedIn ,  isOwner,upload.single('listing[image]'), validatelisting , wrapAsync(listingController.updateListing))    //Update Route 
.delete( isLoggedIn , isOwner, wrapAsync(listingController.destroyListing)); //Delete/Destroy Route



//Edit Route (it gives a form )
router.get("/:id/edit" ,isLoggedIn,
    isOwner,wrapAsync(listingController.renderEditForm)) //joi.dev



module.exports = router;
