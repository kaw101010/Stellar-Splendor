import React from "react";
import ImageGenerator from "./Components/Image.jsx"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Login from "./Components/Login.jsx";
import { useState } from "react";

export default function App() {

  const [user, setUser] = useState(null);

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