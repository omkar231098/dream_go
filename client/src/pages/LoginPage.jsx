import React, { useState } from "react";
import "../styles/Login.scss"
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch ("http://localhost:8500/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      /* Get data after fetching */
      const loggedIn = await response.json()

console.log(loggedIn.message)

      if (loggedIn.message==="Login successful! Redirecting to Home page.") {
        dispatch (
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token
          })
        )
        toast.success(loggedIn.message, {
          position: "top-center",
        });
       navigate("/")
      }else{
        toast.error(loggedIn.message, {
          position: "top-center",
        });
      }



    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
      });
      console.log("Login failed", err.message)
    }
  }

  return (
    <>
     <Navbar   showSearchBar={false}/>
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
        <a href="/register">Don't have an account? Sign In Here</a>
      </div>
    </div>
    </>
    
  );
};

export default LoginPage;
