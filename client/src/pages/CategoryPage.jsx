import { useState, useEffect, useCallback } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();

  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);

  const getFeedListings = useCallback(async () => {
    try {
      const response = await fetch(
        `https://dark-teal-hatchling-hem.cyclic.app/properties?category=${category}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log(data)
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  }, [category, dispatch]);

  useEffect(() => {
    getFeedListings();
  }, [getFeedListings]);

  return (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="list">
          {listings && listings.length > 0 ? (
            listings.map(
              ({
                _id,
                creator,
                listingPhotoPaths,
                city,
                province,
                country,
                category,
                type,
                price,
                booking = false,
              }) => (
                <ListingCard
                  key={_id}
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
            )
          ) : (
            <p>No listings available for {category}.</p>
          )}
        </div>
      )}
      <Footer />
    </>
  );

};

export default CategoryPage;
