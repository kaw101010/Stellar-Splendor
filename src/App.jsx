import React from "react";
import ImageGenerator from "./Components/Image.jsx"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Login.jsx";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./Components/firebaseInit.jsx";
import UserProfile from "./Components/Profile.jsx";
import RetrieveImages from "./Components/LikedImages.jsx";

export default function App() {

  const [user, setUser] = useState(null);
  const [loggedIn, setLogIn] = useState(true);

  const auth = getAuth(app);
  /* Listener to keep track of user status */
  useEffect(() => {
    const authChange = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUser(usr);
        setLogIn(true);
      } else {
        setUser(null);
        setLogIn(false);
      }
    })
    return () => authChange;
  }, []);

  return (
    <>
      <BrowserRouter basename="/">
            <h1 id="heading">Stellar Splendor</h1>
            <h4 id='subheading'>Explore the Cosmos</h4>
          <Routes>
            <Route path="/" element= {<ImageGenerator user={user} setUser={setUser} />} />
            <Route path="/login" element = {<Login user={user} setUser={setUser} />} />
            {loggedIn && (
              <>
                <Route path="/my-profile" element = { <UserProfile user={user} /> } />
                <Route path="/liked-images" element = { <RetrieveImages user={user} /> } />
              </>
            )}
            <Route path="/*" element = { <Navigate to={"/"} /> } />
          </Routes>
      </BrowserRouter>
    </>
  )
}