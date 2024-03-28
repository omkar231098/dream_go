const router = require("express").Router();
const  {ReviewModel}= require("../models/Review");
const Listing= require("../models/Listing");


router.post("/create/:id", async (req, res) => {

    try {
        const listingId = req.params.id;
    
        // Create a new review document
        const newReview = new ReviewModel({
          listing: listingId, // The ID of the doctor being reviewed
          user: req.body.userId, // The ID of the user (patient) submitting the review
          reviewText: req.body.reviewText,
          rating: req.body.rating,
        });
    
        // Save the review
        const savedReview = await newReview.save();
    
        // Add the review's ID to the doctor's reviews array
        await Listing.findByIdAndUpdate(
          listingId, // Ensure this matches the doctor ID from the URL params
          { $push: { reviews: savedReview._id } }
        );
    
        res.status(200).json({ success: true, message: "Review submitted",data:savedReview });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }




});



router.get("/", async (req, res) => {


  try {
   
    const reviews=await ReviewModel.find({})
res.status(200).json({success:true, message: "Successful", data: reviews})


} catch (error) {
    res.status(404).json({success:false, message: "Not Found"})  
}

});




router.get('/listing/:listingId', async (req, res) => {


  console.log("hiiii")
  const { listingId } = req.params;

  try {
    // Find reviews for the specified listing ID and populate user details
    const reviews = await ReviewModel.find({ listing: listingId })
      .populate('user', 'firstName lastName profileImagePath')
      .select('reviewText rating createdAt');

    res.status(200).json({ success: true, reviews: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Error fetching reviews' });
  }
});

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         listing:
 *           type: string
 *         user:
 *           type: string
 *         reviewText:
 *           type: string
 *         rating:
 *           type: number
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Review submitted
 *         data:
 *           $ref: '#/components/schemas/Review'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Internal server error
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Enter your Bearer token in the format "Bearer {token}"
 */

/**
 * @swagger
 * /review/create/{id}:
 *   post:
 *     summary: Create a new review for a listing.
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the listing being reviewed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       '200':
 *         description: Review submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get all reviews.
 *     tags: [Reviews]
 *     responses:
 *       '200':
 *         description: Reviews fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       '404':
 *         description: Reviews not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /review/listing/{listingId}:
 *   get:
 *     summary: Get reviews for a specific listing.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         type: string
 *         description: ID of the listing to fetch reviews for.
 *     responses:
 *       '200':
 *         description: Reviews fetched successfully for the listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       '500':
 *         description: Error fetching reviews for the listing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
