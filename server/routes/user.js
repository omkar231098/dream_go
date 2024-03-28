const router = require('express').Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Listing = require('../models/Listing');
const logger = require('../logger/logger'); // Adjust the path accordingly

/* GET TRIP LIST */
router.get('/:userId/trips', async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Booking.find({ customerId: userId }).populate('customerId hostId listingId');
    logger.info('Trips fetched successfully', { userId });
    res.status(202).json(trips);
  } catch (err) {
    logger.error('Failed to fetch trips', { userId: req.params.userId, error: err.message });
    res.status(404).json({ message: 'Can not find trips!', error: err.message });
  }
});

/* ADD LISTING TO WISHLIST */
router.patch('/:userId/:listingId', async (req, res) => {
  try {
    const { userId, listingId } = req.params;
    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId).populate('creator');

    const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId);

    if (favoriteListing) {
      user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId);
      await user.save();
      logger.info('Listing removed from wish list', { userId, listingId });
      res.status(200).json({ message: 'Listing is removed from wish list', wishList: user.wishList });
    } else {
      user.wishList.push(listing);
      await user.save();
      logger.info('Listing added to wish list', { userId, listingId });
      res.status(200).json({ message: 'Listing is added to wish list', wishList: user.wishList });
    }
  } catch (err) {
    logger.error('Failed to add/remove listing to/from wish list', { userId: req.params.userId, listingId: req.params.listingId, error: err.message });
    res.status(404).json({ error: err.message });
  }
});

/* GET PROPERTY LIST */
router.get('/:userId/properties', async (req, res) => {
  try {
    const { userId } = req.params;
    const properties = await Listing.find({ creator: userId }).populate('creator');
    logger.info('Properties fetched successfully', { userId });
    res.status(202).json(properties);
  } catch (err) {
    logger.error('Failed to fetch properties', { userId: req.params.userId, error: err.message });
    res.status(404).json({ message: 'Can not find properties!', error: err.message });
  }
});

/* GET RESERVATION LIST */
router.get('/:userId/reservations', async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await Booking.find({ hostId: userId }).populate('customerId hostId listingId');
    logger.info('Reservations fetched successfully', { userId });
    res.status(202).json(reservations);
  } catch (err) {
    logger.error('Failed to fetch reservations', { userId: req.params.userId, error: err.message });
    res.status(404).json({ message: 'Can not find reservations!', error: err.message });
  }
});

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       properties:
 *         customerId:
 *           type: string
 *         hostId:
 *           type: string
 *         listingId:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *     Listing:
 *       type: object
 *       properties:
 *         listingId:
 *           type: string
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation successful
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Trip'
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
 * /users/{userId}/trips:
 *   get:
 *     summary: Get trips for a user.
 *     tags: [Trips]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         description: ID of the user.
 *     responses:
 *       '202':
 *         description: Trips fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Trips not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/{userId}/wishlist/{listingId}:
 *   patch:
 *     summary: Add or remove a listing from user's wishlist.
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         description: ID of the user.
 *       - in: path
 *         name: listingId
 *         required: true
 *         type: string
 *         description: ID of the listing.
 *     responses:
 *       '200':
 *         description: Operation successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Operation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/{userId}/properties:
 *   get:
 *     summary: Get properties created by a user.
 *     tags: [Properties]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         description: ID of the user.
 *     responses:
 *       '202':
 *         description: Properties fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Properties not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/{userId}/reservations:
 *   get:
 *     summary: Get reservations made by a user.
 *     tags: [Reservations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         description: ID of the user.
 *     responses:
 *       '202':
 *         description: Reservations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Reservations not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
