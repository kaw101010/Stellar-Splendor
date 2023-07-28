import React from "react";
import ImageGenerator from "./Components/Image.jsx"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login.jsx";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import app from "./Components/firebaseInit.jsx";

export default function App() {

  const [user, setUser] = useState(null);

  const auth = getAuth(app);
  {/* Listener to keep track of user status */}
  useEffect(() => {
    const authChange = auth.onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);
      } else {
        setUser(null);
      }
    })
    return (() => authChange);
  }, []);

  return (
    <>
      <BrowserRouter>
            <h1 id="heading">Stellar Splendor</h1>
            <h4 id='subheading'>Explore the Cosmos</h4>
          <Routes>
            <Route path="/" element= {<ImageGenerator user={user} setUser={setUser} />} />
            <Route path="/login" element = {<Login user={user} setUser={setUser} />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}