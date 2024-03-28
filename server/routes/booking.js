const router = require("express").Router();
const Booking = require("../models/Booking");
const logger = require("../logger/logger"); // Adjust the path accordingly

/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } =
      req.body;
    const newBooking = new Booking({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });
    await newBooking.save();
    res.status(200).json(newBooking);

    // Log success
    logger.info("Booking created successfully", { bookingId: newBooking._id });
  } catch (err) {
    logger.error("Failed to create a new Booking", { error: err.message });
    res
      .status(400)
      .json({ message: "Fail to create a new Booking!", error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      logger.warn("Booking not found for deletion", { bookingId });
      return res.status(404).json({ message: "Booking not found!" });
    }

    res
      .status(200)
      .json({ message: "Booking deleted successfully!", deletedBooking });

    // Log success
    logger.info("Booking deleted successfully", { bookingId });
  } catch (err) {
    logger.error("Failed to delete the booking", { error: err.message });
    res
      .status(400)
      .json({ message: "Fail to delete the booking!", error: err.message });
  }
});

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         customerId:
 *           type: string
 *         hostId:
 *           type: string
 *         listingId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         totalPrice:
 *           type: number
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Booking created successfully!
 *         booking:
 *           $ref: '#/components/schemas/Booking'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Failed to create a new Booking
 *         error:
 *           type: string
 *     DeletedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Booking deleted successfully!
 *         deletedBooking:
 *           $ref: '#/components/schemas/Booking'
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Enter your Bearer token in the format "Bearer {token}"
 */

/**
 * @swagger
 * /bookings/create:
 *   post:
 *     summary: Create a new booking.
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       '200':
 *         description: Booking created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Fail to create a new Booking.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /bookings/delete/{id}:
 *   delete:
 *     summary: Delete a booking by ID.
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Booking ID to delete.
 *     responses:
 *       '200':
 *         description: Booking deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeletedResponse'
 *       '404':
 *         description: Booking not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

