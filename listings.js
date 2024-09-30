const { query } = require("express");
const Listing = require("../MODELS/Listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.Map_Token;
const geocodingClient = mbxGeocoding({ accessToken : mapToken });

module.exports.index = async(req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
} ;

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new ejs");
};

module.exports.showListing = async(req, res )=>{
    let { id } = req.params;                 // req.params = extract/gave to ID
    const listing  = await Listing.findById(id)
    .populate({path : "reviews" ,populate : { path : "author"}, }).populate("owner");
    if(!listing){
        req.flash("error" , "Listing you requested not available");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing });
};

module.exports.createListing = async(req, res , next)=>{
    let response = await geocodingClient
    .forwardGeocode({
        query : req.body.listing.location,
        limit : 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing (req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename};

    newListing.geomatry =   response.body.features[0].geomatry;

    let savedListing =  await newListing.save();
    console.log(savedListing);
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");

};

module.exports.renderEditForm = async(res , req)=>{
    let { id } = req.params;
    const listing  = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing you requested not available");
        res.redirect("/listings");
    }

    let orignalImagUrl = listing.image.url;
    orignalImagUrl = orignalImagUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs" , {listing});
};

   module.exports.updateListing = async(req, res)=>{
       let { id } = req.params;
       let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});// {...req.body.listing}= it is an object which contain
      if(typeof req.file !== "undefined"){                //typeof = it check value undefined or not .
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url , filename };
      await listing.save();
      }
      req.flash("success" , " Listing Updated!");
      res.redirect(`listings/${id}`);                                               //parameters then this parameter convert
    }
  //        //indivisual value then pass new updated value

  module.exports.destroyListing = async(req, res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , " Listing Deleted!");
    res.redirect("/listings");
};