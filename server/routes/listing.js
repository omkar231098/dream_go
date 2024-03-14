const router = require("express").Router();
require("dotenv").config();
const multer = require("multer");
const ImageKit = require("imagekit");
const Listing = require("../models/Listing");
const logger = require("../logger/logger"); 
const limiter = require("../ratelimiter/limiter");


const imagekit = new ImageKit({
  publicKey: process.env.publicKey,
  privateKey: process.env.privateKey,
  urlEndpoint: process.env.urlEndpoint,
});

const storage = multer.memoryStorage(); 
const upload = multer({ storage });


/* CREATE LISTING */
router.post("/create",limiter , upload.array("listingPhotos"), async (req, res) => {
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
      logger.warn('No file uploaded.');
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

    logger.info('Listing created successfully', { listingId: newListing._id });

    res.status(200).json(newListing);
  } catch (err) {
    logger.error('Fail to create Listing', { error: err.message });
    res
      .status(409)
      .json({ message: "Fail to create Listing", error: err.message });
    console.log(err);
  }
});

/* GET lISTINGS BY CATEGORY */
router.get('/', async (req, res) => {
  const qCategory = req.query.category;

  try {
    let listings;
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate('creator');
    } else {
      listings = await Listing.find().populate('creator');
    }

    logger.info('Listings fetched successfully');
    res.status(200).json(listings);
  } catch (err) {
    logger.error('Fail to fetch listings', { error: err.message });
    res.status(404).json({ message: 'Fail to fetch listings', error: err.message });
  }
});

/* GET LISTINGS BY SEARCH */
router.get('/search/:search', async (req, res) => {
  const { search } = req.params;

  try {
    let listings = [];

    if (search === 'all') {
      listings = await Listing.find().populate('creator');
    } else {
      listings = await Listing.find({
        $or: [
          { city: { $regex: search, $options: 'i' } }, // Search by city
          { category: { $regex: search, $options: 'i' } }, // Search by category
          { country: { $regex: search, $options: 'i' } }, // Search by country
          { title: { $regex: search, $options: 'i' } }, // Search by title
          { province: { $regex: search, $options: 'i' } }, // Search by province
        ],
      }).populate('creator');
    }

    logger.info('Listings fetched successfully for search:', { search });
    res.status(200).json(listings);
  } catch (err) {
    logger.error('Fail to fetch listings for search:', { search, error: err.message });
    res.status(404).json({ message: 'Fail to fetch listings', error: err.message });
  }
});

/* LISTING DETAILS */
router.get('/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate('creator');

    if (listing) {
      logger.info('Listing fetched successfully', { listingId });
      res.status(202).json(listing);
    } else {
      logger.warn('Listing not found', { listingId });
      res.status(404).json({ message: 'Listing not found!' });
    }
  } catch (err) {
    logger.error('Failed to fetch listing', { listingId: req.params.listingId, error: err.message });
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Delete a listing by ID
router.delete('/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;

    // Fetch the listing before deleting it
    const listing = await Listing.findById(listingId);

    // Check if the listing exists
    if (!listing) {
      logger.warn('Listing not found for deletion', { listingId });
      return res.status(404).json({ success: false, message: 'Listing not found!' });
    }

    // Extract file IDs from the listing
    const fileIds = listing.listingPhotoPaths.map((photo) => photo.fileId);

    // Check if file IDs are valid
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      logger.warn('Invalid or empty fileIds array', { listingId, fileIds });
      return res.status(400).json({ success: false, message: 'Invalid or empty fileIds array' });
    }

    // Delete files from ImageKit
    const response = await imagekit.bulkDeleteFiles(fileIds);

    // Delete the listing
    const deletedListing = await Listing.findByIdAndDelete(listingId);

    logger.info('Listing and associated images deleted successfully', {
      listingId,
      deletedListing,
      response,
      deletedFileIds: fileIds,
    });

    res.status(200).json({
      success: true,
      message: 'Listing and associated images deleted successfully',
      deletedListing,
      response,
      deletedFileIds: fileIds,
    });
  } catch (err) {
    // Handle any internal server errors
    logger.error('Failed to delete the listing', { listingId: req.params.listingId, error: err.message });
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});




module.exports = router
