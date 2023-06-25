import React from "react";
import ImageGenerator from "./Components/Image.jsx"
import { Button } from "react-bootstrap";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import app from "./Components/firebaseInit.jsx";

export default function App() {
  return (
    <>
      <h1 id="heading">Stellar Splendor</h1>
      <h4 id='subheading'>Explore the Cosmos</h4>
      <Button variant="outline-primary" className="login_btn" size="lg" onClick={(e) => {
        e.preventDefault()
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
        }}>Login</Button>
      <ImageGenerator />
      <h4 id="subheading">A captivating image of the Universe!</h4>
      <h4 id="subheading">Take a look at the eternal beauty of the cosmos and its marvels</h4>
      <a href="https://apod.nasa.gov/apod/archivepix.html" rel="image-source" target="_blank"><p>Image Source</p></a>
    </>
  )
}