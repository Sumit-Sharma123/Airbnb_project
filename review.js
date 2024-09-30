const express = require("express");
const router = express.Router({ mergeParams : true});
const wrapAsync = require("../Utils/WrapAsync.js");
const expressError = require("../Utils/ExpressError.js");
const Review = require("../MODELS/review.js");
const Listing = require("../MODELS/Listing.js");
const { validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../Controller/reviews.js");
const review = require("../MODELS/review.js");

//Reviews
//post review route 
router.post("/" ,isLoggedIn, validateReview, WrapAsync(reviewController.createReview));

//Delete Review route
router.delete("/:reviewId", isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));
