import React from "react";
import ImageGenerator from "./Components/Image.jsx"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Login from "./Components/Login.jsx";
import { useState } from "react";

export default function App() {
  return (
    <>
      <BrowserRouter>
            <h1 id="heading">Stellar Splendor</h1>
            <h4 id='subheading'>Explore the Cosmos</h4>
          <Routes>
            <Route path="/" element= {<ImageGenerator isLoggedIn={false}/>} />
            <Route path="/login" element = {<Login />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}