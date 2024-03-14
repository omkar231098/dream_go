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
