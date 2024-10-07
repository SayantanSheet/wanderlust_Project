const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req, res) => {
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewFrom=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).
    populate({
        //mana protak tar listing ar jonno all reviews ar satha author o jano asa
        path:"reviews",
        populate:{
            path:"author" //nested populates
        }
    })
    .populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async(req, res,next) => {
    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
       .send()
    //let{title,description,image,price,country,location}=req.body;
let url=req.file.path;
let filename=req.file.filename;
const newListing=new Listing(req.body.listing);
newListing.owner=req.user._id; //user id gula owner field a set kora6i
newListing.image={url, filename};

newListing.geometry=response.body.features[0].geometry;

let savedListing=await newListing.save();
console.log(savedListing);
req.flash("success","New Listing Created");
res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");//image quality koma hoya galo
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});//deconstruct

   if(typeof req.file!== "undefined"){ // check if image file exists then update
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url, filename};
    await listing.save();
   }

    req.flash("success","Listing Updated!"); 
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};