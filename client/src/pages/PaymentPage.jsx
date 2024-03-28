import React from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import style from "../styles/paymentpage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

const PaymentPage = () => {
  const location = useLocation();
  const { state } = location;
  const {
    dateRange,
    imageUrl,
    title,
    type,
    Listingprice,
    count,
    guestcount,
    customerId,
    lisitingCreator,
    startDate,
    endDate,
  } = state || {};
  const { listingId } = useParams();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [fullName, setFullName] = useState("");
  const startDateString =
    state && state.dateRange && state.dateRange.length > 0
      ? state.dateRange[0].startDate.toDateString()
      : "";
  const endDateString =
    state && state.dateRange && state.dateRange.length > 0
      ? state.dateRange[0].endDate.toDateString()
      : "";

  const formatted_price = Listingprice
    ? Listingprice.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      })
    : "";

  const totalprice = Listingprice ? Listingprice * count : 0;

  const formatted_totalprice = totalprice.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const cgstRate = 9; // CGST rate (example: 9%)
  const sgstRate = 9; // SGST rate (example: 9%)
  const taxAmount = totalprice ? (totalprice * (cgstRate + sgstRate)) / 100 : 0;

  const formatted_taxAmount = taxAmount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const totalPriceWithTax = totalprice + taxAmount;
  const formattedPrice = totalPriceWithTax.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  // Generate options for months (1-12)
  const monthOptions = Array.from({ length: 12 }, (_, index) => (
    <option key={index + 1} value={index + 1}>
      {index + 1}
    </option>
  ));

  // Generate options for years (current year to 2030)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year <= 2030; year++) {
    years.push(year);
  }
  const yearOptions = years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ));

  const handleCardNumberChange = (e) => {
    const input = e.target.value;
    const formattedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
    const maxLength = 16; // Limit to 16 digits

    if (formattedInput.length <= maxLength) {
      setCardNumber(formattedInput);
    }
  };

  const handleCvvChange = (e) => {
    const input = e.target.value;
    const formattedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
    const maxLength = 3; // Limit to 3 digits

    if (formattedInput.length <= maxLength) {
      setCvv(formattedInput);
    }
  };

  const handleFullNameChange = (e) => {
    const inputValue = e.target.value;
    const onlyAlphabets = /^[A-Za-z\s]+$/;

    // Check if the input matches the pattern (only alphabetic characters)
    if (onlyAlphabets.test(inputValue) || inputValue === "") {
      setFullName(inputValue); // Update the state only if the input is valid
    }
  };

  const handleSubmit = async () => {
    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: lisitingCreator,
        startDate,
        endDate,
        totalPrice: totalPriceWithTax,
      };

      console.log("Booking Form:", bookingForm); // Log the booking form data for debugging

      const response = await fetch(
        "https://dark-teal-hatchling-hem.cyclic.app/bookings/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingForm),
        }
      );

      if (response.ok) {
        const responseData = await response.json(); // Parse response data if available
        console.log("API Response:", responseData); // Log the API response for debugging

        toast.success("Reservation is successful.", {
          position: "top-center",
        });

        setTimeout(() => navigate(`/${customerId}/trips`), 4000);
      } else {
        throw new Error(`Error: ${response.statusText}`); // Throw an error if response is not OK
      }
    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
      });
      console.log("Submit Booking Failed.", err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className={style.mainbox}>
        <div className={style.title}>Confirm and pay</div>
        <div className={style.mainsubbox}>
          <div className={style.mainbox_1}>
            <hr className={style.hrline_1} />
            <hr className={style.hrline_divider} />
            <div className={style.mainbox_1_title}>
              <h2>Your trip</h2>
            </div>
            <div className={style.mainbox_1_date}>
              <h3>Dates</h3>
              <p>
                {startDateString} - {endDateString}
              </p>
            </div>

            <div className={style.mainbox_1_guest}>
              <h3>Guests</h3>
              <p>{guestcount} Guests</p>
            </div>

            <hr className={style.hrline_1} />
            <hr className={style.hrline_divider} />

            <div className={style.paymentbox}>
              <div className={style.paymentForm}>
                <label>Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={handleFullNameChange}
                  placeholder="Enter Full Name"
                  pattern="[A-Za-z]+"
                  required
                />

                <label>Card Number</label>
                <input
                  type="number"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardNumber}
                  maxLength={16}
                  pattern="[0-9]{16}"
                  required
                  onChange={handleCardNumberChange}
                  placeholder="16 digits"
                />

                <label>CVV</label>
                <input
                  type="number"
                  id="cvv"
                  name="cvv"
                  value={cvv}
                  onChange={handleCvvChange}
                  pattern="[0-9]{3}"
                  maxLength={3} // Ensure CVV is exactly 3 digits
                  required
                  placeholder="3 digits"
                />

                <div className={style.expiryContainer}>
                  <label>Expiry Date</label>
                  <div className={style.expiryInputs}>
                    <div>
                      {" "}
                      <select name="expiryMonth" required>
                        <option value="">Month</option>
                        {monthOptions}
                      </select>
                    </div>

                    <div>
                      {" "}
                      <select name="expiryYear" required>
                        <option value="">Year</option>
                        {yearOptions}
                      </select>
                    </div>
                  </div>
                </div>

                <button onClick={handleSubmit} className={style.submitButton}>
                  Pay Now
                </button>
              </div>
            </div>
          </div>

          <div className={style.mainbox_2}>
            <div className={style.mainbox_2_box_1}>
              <div>
                <img
                  className={style.paymentimage}
                  src={imageUrl}
                  alt="Listing"
                />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{type}</p>
              </div>
            </div>

            <hr className={style.hrline_1} />
            <hr className={style.hrline_divider} />
            <div className={style.mainbox_2_box_2}>
              <div className={style.mainbox_2_pricetitle}>
                <h2>Price Details</h2>
              </div>
              <div className={style.mainbox_2_pricebox}>
                <p>
                  {formatted_price} x {count} nights
                </p>
                <p>{formatted_totalprice}</p>
              </div>
              <div className={style.mainbox_2_taxbox}>
                <p>Taxes</p>
                <p>{formatted_taxAmount}</p>
              </div>

              <hr className={style.hrline} />

              <div className={style.mainbox_2_totalpricebox}>
                <h3>Total (INR)</h3>
                <h3>{formattedPrice}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
