import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { toast } from 'react-toastify';
import ReviewList from "./ReviewList";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import "react-date-range/dist/styles.css"; // Import styles
import "react-date-range/dist/theme/default.css"; // Import theme styles

import WriteReview from '../pages/WriteReview';

const ListingDetails = (data) => {
  const [loading, setLoading] = useState(true);
 
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [expanded, setExpanded] = useState(false); // State for expanded review section
  const [writingReview, setWritingReview] = useState(false);
    // Function to toggle expanded state
    const toggleExpand = () => {
      setExpanded(!expanded);
    };
  
  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `https://dark-teal-hatchling-hem.cyclic.app/properties/${listingId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log(data)
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };

  const handleWriteReview = () => {
    setWritingReview(true);
  };

  const handleCloseReview = () => {
    setWritingReview(false);
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const customRangeColors = ['#4c1dab', '#4c1dab', '#4c1dab'];

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Calculate the difference in day unit

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id);

  const navigate = useNavigate();

  const handleSubmit = async () => {

        if (!customerId) {
        // If user is not logged in, show a message to log in
        toast.warning("Please log in to make a reservation.", {
          position: "top-center",
        });

        setTimeout(() => navigate("/login"), 4000); 
        return; // Prevent further execution
      }

      if (dayCount < 1) {
        // Check if user has selected at least 1 night
        toast.error("Please select at least 1 night.", {
          position: "top-center",
        });
        return; // Prevent further execution
      }
      
    navigate(`/payment/${listingId}`, { state: {
       dateRange ,
        title: listing.title,
        imageUrl: listing.listingPhotoPaths[0]?.url,
        type:listing.type,
        Listingprice:listing.price,
        count:dayCount,
      guestcount:listing.guestCount,
      customerId:customerId,
      lisitingCreator:listing.creator._id,
      startDate: dateRange[0].startDate.toDateString(),
      endDate: dateRange[0].endDate.toDateString(),
      } });
    

    
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item, index) => (
            <img key={index} src={item.url} alt="listing" /> // Updated to use ImageKit.io URL
          ))}
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={listing.creator.profileImagePath} alt="creator"// Updated to use ImageKit.io URL
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>


            <div>
        {writingReview ? (
          <WriteReview listingId={listingId} onClose={handleCloseReview} />
        ) : (
          <button className='WriteReviewButton' onClick={handleWriteReview}>
            Write Review
          </button>
        )}
      </div>

    <div className={`review-section ${expanded ? 'expanded' : ''}`}>
          <h2 className='reviewtitle'>Reviews</h2>
          <ReviewList listingId={listingId}  /> {/* Pass listingId to ReviewList component */}
        </div>

        {/* Always show the link */}
        <p className="expand-link" onClick={toggleExpand}>
          <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
        </p>

          </div>
    
        
          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect}  rangeColors={customRangeColors}  />
              {dayCount > 1 ? (
                <h2>
                 ₹{listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ₹{listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ₹{listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <button
                className="button"
                type="submit"
                onClick={handleSubmit}
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ListingDetails;
