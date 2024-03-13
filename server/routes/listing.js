const router = require("express").Router();
require("dotenv").config();
const multer = require("multer");
const ImageKit = require("imagekit");
const Listing = require("../models/Listing");




const imagekit = new ImageKit({
  publicKey: process.env.publicKey,
  privateKey: process.env.privateKey,
  urlEndpoint: process.env.urlEndpoint,
});

const storage = multer.memoryStorage(); 
const upload = multer({ storage });






/* CREATE LISTING */
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {
    /* Take the information from the form */
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files;

    if (!listingPhotos) {
      return res.status(400).send("No file uploaded.");
    }

    // Upload listing photos to ImageKit.io
    const listingPhotoData = await Promise.all(
      listingPhotos.map(async (file) => {
        const response = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/uploads/listings",
        });
        return {
          fileId: response.fileId,
          url: response.url,
        };
      })
    );

    const listingPhotoPaths = listingPhotoData.map((data) => data);

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    await newListing.save();

    res.status(200).json(newListing);
  } catch (err) {
    res
      .status(409)
      .json({ message: "Fail to create Listing", error: err.message });
    console.log(err);
  }
});

/* GET lISTINGS BY CATEGORY */
router.get("/", async (req, res) => {
  const qCategory = req.query.category

  try {
    let listings
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate("creator")
    } else {
      listings = await Listing.find().populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})

/* GET LISTINGS BY SEARCH */
router.get("/search/:search", async (req, res) => {
  const { search } = req.params

  try {
    let listings = []

    if (search === "all") {
      listings = await Listing.find().populate("creator")
    } else {
      listings = await Listing.find({
        $or: [
          { city: { $regex: search, $options: "i" } }, // Search by city
          { category: { $regex: search, $options: "i" } }, // Search by category
          { country: { $regex: search, $options: "i" } }, // Search by country
          { title: { $regex: search, $options: "i" } }, // Search by title
          { province: { $regex: search, $options: "i" } }, // Search by province
        ]
      }).populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})

/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params
    const listing = await Listing.findById(listingId).populate("creator")
    res.status(202).json(listing)
  } catch (err) {
    res.status(404).json({ message: "Listing can not found!", error: err.message })
  }
})





// Delete a listing by ID
router.delete("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;

    // Fetch the listing before deleting it
    const listing = await Listing.findById(listingId);

    // Check if the listing exists
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found!" });
    }

    // Extract file IDs from the listing
    const fileIds = listing.listingPhotoPaths.map((photo) => photo.fileId);

    // Check if file IDs are valid
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty fileIds array' });
    }

    
    const response = await imagekit.bulkDeleteFiles(fileIds);

    const deletedListing = await Listing.findByIdAndDelete(listingId);
   
      res.status(200).json({
        success: true,
        message: 'Listing and associated images deleted successfully',
        deletedListing,
        response,
        deletedFileIds: fileIds,
      });
   
    
  } catch (err) {
    // Handle any internal server errors
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});





module.exports = router
