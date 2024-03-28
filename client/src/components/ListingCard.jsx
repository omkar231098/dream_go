import { useState } from "react";
import "../styles/ListingCard.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";
import { deleteProperty } from "../redux/state"; 
import { deleteTrip } from "../redux/state"; 
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Cancel'; 
import { toast } from 'react-toastify';

const ListingCard = ({

  listingId,
  bookingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
  showDeleteButton,
  showReserveButton,
  showLikeButton
 
}) => {
  /* SLIDER FOR IMAGES */
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);


  const handleDelete = async () => {
    try {
      // Perform the delete action here, e.g., by making a DELETE request to your API
     const response= await fetch(`https://dark-teal-hatchling-hem.cyclic.app/properties/${listingId}`, {
        method: "DELETE",
      });

      toast.success("Listing and associated images deleted successfully", {
        position: "top-center",
      });

console.log(response)

      // Dispatch the action to update the state in Redux
      dispatch(deleteProperty(listingId));
    } catch (err) {
      console.log("Delete property failed", err.message);
    }
  };

  const handleReserve = async () => {
    // console.log(bookingId)
    try {
      const response = await fetch(`https://dark-teal-hatchling-hem.cyclic.app/bookings/delete/${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Booking cancel successfully", {
          position: "top-center",
        });

        dispatch(deleteTrip(bookingId));
      } else {
        console.error("Failed to cancel booking:", response.statusText);
      }
    } catch (err) {
      console.error("Cancel booking failed", err.message);
    }
  };




  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const patchWishList = async () => {
    // console.log(user._id);
    // console.log(listingId);
    // console.log(creator._id);
    if (user?._id !== creator._id) {
      try {
        const response = await fetch(
          `https://dark-teal-hatchling-hem.cyclic.app/users/${user?._id}/${listingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

       
        if (response.ok) {
          const data = await response.json();

          toast.success(data.message, {
            position: "top-center",
          });

          console.log(data)
          // console.log(data);
          dispatch(setWishList(data.wishList)); 
          
          
         
          // Assuming data structure is correct
        } else {
          console.error("Failed to patch wishlist:", response.statusText);
        }
      } catch (error) {
        console.error("Error patching wishlist:", error.message);
      }
    } else {
      
      toast.success("Listing already in your property list.", {
        position: "top-center",
      });
      navigate(`/${user._id}/properties`)
    }
  };

  return (
    <div
      className="listing-card"
      onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => (
            <div key={index} className="slide">
              <img src={photo.url} alt={`Slide ${index + 1}`} /> 
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3>
        {city}, {province}, {country}
      </h3>
      <p className="categorycolor">{category}</p>

      {!booking ? (
        <>
          <p className="typecolor">{type}</p>
          <p >
            <span  className="price_tag">₹{price}</span> per night
          </p>
         
          


        </>
      ) : (
        <>
          <p>
            {startDate} - {endDate}
          </p>
          <p>
            <span>₹{totalPrice}</span> total
          </p>
         
        </>
      )}

{showLikeButton &&( <button
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        disabled={!user}
      >
        {isLiked ? (
          <FavoriteTwoToneIcon sx={{ color: "red" }} />
        ) : (
          <FavoriteTwoToneIcon sx={{ color: "white" }} />
        )}
      </button>)}
     


      {showDeleteButton && (
        <button className="delete-button" onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}>
          <DeleteIcon />
        </button>
      )}

 {showReserveButton && (
        <button className="reserve-button" onClick={(e) => {
          e.stopPropagation();
          handleReserve();
        }}>
         <CancelIcon /> Cancel Reservation
        </button>
      )}

    </div>
  );
};

export default ListingCard;
