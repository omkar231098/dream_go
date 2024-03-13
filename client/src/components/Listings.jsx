import { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const listings = useSelector((state) => state.listings);

  useEffect(() => {
    const getFeedListings = async () => {
      try {
        const response = await fetch(
          selectedCategory !== "All"
            ? `http://localhost:8500/properties?category=${selectedCategory}`
            : "http://localhost:8500/properties",
          {
            method: "GET",
          }
        );
        const data = await response.json();
        dispatch(setListings({ listings: data }));
        setLoading(false);
      } catch (err) {
        console.log("Fetch Listings Failed", err.message);
      }
    };
  
    getFeedListings(); // Call getFeedListings inside useEffect
  
  }, [selectedCategory, dispatch]); // Include getFeedListings in the dependency array

  return (
    <>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category ${category.label === selectedCategory ? "selected" : ""}`}
            key={index}
            onClick={() => setSelectedCategory(category.label)}
          >
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="listings">
          {listings.map(
            ({
              _id,
              creator,
              listingPhotoPaths, // Assuming this now contains ImageKit.io URLs
              city,
              province,
              country,
              category,
              type,
              price,
              booking=false
            }) => (
              <ListingCard
                key={_id} // Added key prop
                listingId={_id}
                creator={creator}
                listingPhotoPaths={listingPhotoPaths}
                city={city}
                province={province}
                country={country}
                category={category}
                type={type}
                price={price}
                booking={booking}
                showLikeButton={true}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default Listings;
