import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import {useRef, useState, useEffect  } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import { ToastContainer, toast } from 'react-toastify';

const Navbar = ({ showSearchBar = true, showBecomeHostText = true }) => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref for dropdown menu


  const handleBecomeHostClick = () => {
    if (user) {
     
      
      
    } else {
      // Show toast message for non-logged-in users
     

      toast.warning("Please login to become a host.", {
        position: "top-center",
        
      });
    }
  };

   // Function to handle clicking outside the dropdown menu
   const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownMenu(false);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <a href="/">
        <img src="/assets/logo.png" alt="Website Logo" />
      </a>

      {showSearchBar && (
        <div className="navbar_search">
          <input
            type="text"
            placeholder="Search ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton disabled={search === ""}>
            <Search
              sx={{ color: variables.pinkred }}
              onClick={() => {
                navigate(`/properties/search/${search}`);
              }}
            />
          </IconButton>
        </div>
      )}

      <div className="navbar_right">
        
      <ToastContainer />
      {user ? (
        <Link to="/create-listing" className="host" onClick={handleBecomeHostClick}>
          Become A Host
        </Link>
      ) : (
        <Link to="/login" className="host" onClick={handleBecomeHostClick}>
          Become A Host
        </Link>
      )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <img
              src={user.profileImagePath} 
              alt="Profile"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu" ref={dropdownRef}>
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu" ref={dropdownRef}>
            <Link to={`/${user._id}/trips`}>Reservation List</Link>
            <Link to={`/${user._id}/wishList`}>Wish List</Link>
            <Link to={`/${user._id}/properties`}>My Property List</Link>
            <Link to={`/create-listing`}>Become Host</Link>
            {/* <Link to={`/${user._id}/reservations`}>Reservation List</Link> */}
            <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
