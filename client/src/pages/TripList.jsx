import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);
// console.log(tripList)
  const dispatch = useDispatch();



  useEffect(() => {
    const getTripList = async () => {
      try {
        const response = await fetch(
          `https://dark-teal-hatchling-hem.cyclic.app/users/${userId}/trips`,
          {
            method: "GET",
          }
        );
  
        const data = await response.json();
        dispatch(setTripList(data));
        setLoading(false);
      } catch (err) {
        console.log("Fetch Trip List failed!", err.message);
      }
    };
  
    getTripList(); // Call getTripList inside useEffect
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {tripList?.map(({ _id,listingId, hostId, startDate, endDate, totalPrice, booking=true }) => (
          <ListingCard
            bookingId={_id}
            listingId={listingId._id}
            creator={hostId._id}
            listingPhotoPaths={listingId.listingPhotoPaths}
            city={listingId.city}
            province={listingId.province}
            country={listingId.country}
            category={listingId.category}
            startDate={startDate}
            endDate={endDate}
            totalPrice={totalPrice}
            booking={booking}
            showReserveButton={true}
          />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
