import React, { useEffect, useState } from "react";
import data from './keys.json';
import '../App.css'
import axios from "axios";
import { Accordion, Image, Button } from "react-bootstrap";
import { Link,  useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import Login from "./Login.jsx";

function RandomDate() {
    let begin = new Date(2015, 0, 1); // Date when NASA started posting the picture of the day
    let end = new Date(); // Current date
    let date = new Date(
        begin.getTime() +
          Math.random() * (end.getTime() - begin.getTime()),
      );
    let date_str = [date.getFullYear().toString(),(date.getMonth() + 1).toString(), date.getDate().toString()];
    return date_str.join('-');
}

export default function ImageGenerator({isLoggedIn, user}) {
    const [resp, setResp] = useState(null);
    const nav = useNavigate();
    // Call function to get the random date
    const fetchImage = () => {
        let newDate = RandomDate();
        const apiUrl = `${data.ApiUrl}?api_key=${data.ApiKey}&date=${newDate}`;
        
        axios.get(apiUrl)
          .then((response) => {
            if (response.status === 200) {
              setResp(response.data);
            } else {
              console.log("Error");
            }
          })
          .catch((error) => {
            console.log("Error", error);
          });
      };
    
      useEffect(() => {
        fetchImage(); // Call the API on component mount
      }, []);

    if (!resp) {
        return null;
    }

    function copyrightRender()
    {
        return (
            <Accordion.Item eventKey="1">
                <Accordion.Header><strong>Credits</strong></Accordion.Header>
                <Accordion.Body>
                    {resp.copyright}
                </Accordion.Body>
            </Accordion.Item>
        )
    }


    const LoginBtn = () => {
        return (
            <Link to="/login" className="login_btn">
                <Button>Login</Button>
            </Link>
        )
    }

    const showUserProfile = () => {
        return (
            <>
                <Button size="lg" variant="outline-secondary"
                onClick={(e) => {
                    e.preventDefault()
                    const auth = getAuth();
                    signOut(auth).then(() => {
                        nav("/");
                    }).catch((error) => {
                        console.log(error)
                    });
                }}>
                    Logout
                </Button>
                <img src={user.photoURL} height={"50px"} ></img>
            </>
        );
        }

    return (
        <div className="accordion_info">
            <h1 id="img-title">{resp.title}</h1>
            {isLoggedIn ? showUserProfile() : LoginBtn()}
            <Image src={resp.hdurl} fluid onMouseMove={
                function (event) {
                    // Get the boundaries
                    const { top, bottom, left, right } = event.target.getBoundingClientRect();

                    const centreX = (right - left) / 2;
                    const centreY = (bottom - top) / 2;
                  
                    const offsetX = (event.clientX - centreX) / centreX;
                    const offsetY = (centreY - event.clientY) / centreY;

                    event.target.style.transform = `
                    perspective(1000px)
                    rotateY(${-offsetX *7}deg)
                    rotateX(${-offsetY * 7}deg)
                    scale3d(1, 1, 1)`;
                }
            }
            
            onMouseLeave={
                (event) => {
                    event.target.style.transform = 'none';
                }
            }   
            
            />
            <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header><strong>Description of the image</strong></Accordion.Header>
                    <Accordion.Body>
                        {resp.explanation}
                    </Accordion.Body>
                </Accordion.Item>
                {resp.copyright && copyrightRender()}
            </Accordion>
            <div className="new-img">
                <Button variant="outline-secondary" onClick={fetchImage}>Generate new image</Button>
            </div>
            <h4 id="subheading">A captivating image of the Universe!</h4>
            <h4 id="subheading">Take a look at the eternal beauty of the cosmos and its marvels</h4>
            <a href="https://apod.nasa.gov/apod/archivepix.html" rel="image-source" target="_blank"><p>Image Source</p></a>
        </div>
    );
}
