import { useEffect, useState } from "react";
import data from "./keys.json";
import "../App.css";
import axios from "axios";
import { Accordion, Image, Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { Link,  useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import user_icon from "../assets/person.svg";
import star_icon from "../assets/star-icon.svg";
import like_icon from "../assets/star-icon-clicked.svg";
import { getDatabase, ref, update, remove, get } from "firebase/database";

function RandomDate() {
    let begin = new Date(2015, 0, 1); // Date when NASA started posting the picture of the day
    let end = new Date(); // Current date
    let date = new Date(
        begin.getTime() +
          Math.random() * (end.getTime() - begin.getTime()),
      );
    let date_str = [date.getFullYear().toString(),(date.getMonth() + 1).toString(), date.getDate().toString()];
    return date_str.join("-");
};

function GenerateImageID() {
    // Function to generate a unique ID for every image
    const date = new Date();
    const randString ="img" + date.getMilliseconds().toString() + Math.random().toString(21).replace(".", "");
    // Pad the string to get a random string of 21 characters
    return randString.padEnd(21, "a");
}

export default function ImageGenerator({user, setUser}) {
    const [resp, setResp] = useState(null);
    const nav = useNavigate();
    const [liked, isLiked] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [LikedObj, setLikedObj] = useState(false);
    const handleClose = () => {
        // Function to show modal alert if user is not logged in and clicks on like button
        setShowAlert(false);
        setLikedObj(false);
    }

    const UserRegEmail = user?.email; // User email

    // Random ID for every image that is generated
    const [randomID, setRandomID] = useState(GenerateImageID());
    // Call function to get the random date
    const fetchImage = () => {
        isLiked(false);
        let newDate = RandomDate();
        const apiUrl = `${data.ApiUrl}?api_key=${data.ApiKey}&date=${newDate}`;

        setRandomID(GenerateImageID());
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
          window.scrollTo(0,0);
      };
    
      useEffect(() => {
        fetchImage(); // Call the API
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
                <Button id="login_link">Login</Button>
            </Link>
        )
    };

    const UserMenu = () => {
        return (
            <DropdownButton
            align="end"
            title="Settings"
            id="dropdown-menu-align-end"
            className="menu_dropdown"
            >
                <Dropdown.Item eventKey="1" className="menu_btn" href="/liked-images" ><Image src={like_icon} height={"18px"} /> Liked Images</Dropdown.Item>
                <Dropdown.Item eventKey="2" className="menu_btn" href="/my-profile" ><img src={user_icon} alt="user icon" height={"20px"} id="user_icon" />My profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4" className="menu_btn"
                onClick={(e) => {
                    e.preventDefault()
                    const auth = getAuth();
                    signOut(auth).then(() => {
                        setUser(null);
                        nav("/");
                    }).catch((error) => {
                        console.log(error)
                    });
                }}
                >Logout</Dropdown.Item>
            </DropdownButton>
        )
    }

    const GeneratedImg = (() => {
        return(
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
                    rotateY(${-offsetX *5}deg)
                    rotateX(${-offsetY *5}deg)
                    scale3d(1, 1, 1)`;
                }
            }
            
            onMouseLeave={
                (event) => {
                    event.target.style.transform = "none";
                }
            } onError={fetchImage} alt="universe image" loading="lazy" height={"900px"} width={"1000px"} />
        )
    });


    const GeneratedVid = (() => {
        return (
            <div className="iframe_wrapper">
                <iframe src={resp.url} height={"500px"} width={"800px"} className="video_media" ></iframe>
            </div>
        )
    })
    
    const db = getDatabase();

    const ImageLiked = async () => {
        if (!user) {
            setShowAlert(true);
            return;
        }

        // Function to add image to liked images in user account
        // Create a reference to the database
        const bucket = UserRegEmail?.replace(/[@#.]/g, "*");
        const media_url = (resp.media_type === "image" ? resp.hdurl : resp.url );
        const media_type = resp.media_type;
        const media_title = resp.title;
        const media_description = resp.explanation || "There is no description";
        // Check if image has not already been liked by user
        const snap = await get(ref(db, "users/" + bucket + "/"));
        let search_flag = false; // Variable that checks if user has already liked an image
        if (snap.exists()) {
            const snapVals = Object.values(snap.val());
            for (let i = 0; i < snapVals.length; i++) {
                if (snapVals[i].media_title === media_title) {
                    // Element has been liked by user before
                    setLikedObj(true);
                    search_flag = true;
                    break;
                }
            }
        }
        if (!search_flag) {
            update(ref(db, "users/" + bucket + "/" + randomID), {
                media_url,
                media_type,
                media_title,
                randomID,
                media_description,
            });
            isLiked(true);
        }
    }

    const ImageNotLiked = () => {
        // Function to remove image from liked images in user account
        // Remove impermissible characters
        const bucket = UserRegEmail?.replace(/[@#.]/g, "*");
        const UserRef = ref(db, "users/" + bucket + "/" + randomID);
        // Remove image from user account
        remove(UserRef);
        isLiked(false);
    }

    const LikeBtn = (({src}) => {
        return (
            <Image src={src} height={"70px"} alt="like icon" className="like_icon" role="like button" onClick={ImageLiked} />
        );
    });

    const LikedBtn = (({src}) => {
        return (
            <Image src={src} height={"70px"} alt="liked icon" className="liked_icon" role="dislike button" onClick={ImageNotLiked} />
        )
    });

    return (
            <div className="accordion_info">
                <h1 id="img-title">{resp.title}</h1>
                {user ? <UserMenu /> : LoginBtn()}
                {showAlert && 
                // Show alert if user is not logged in and tries to like media
                <Modal show={showAlert} onHide={handleClose}>
                    <Modal.Header>
                        Please Log In
                    </Modal.Header>
                </Modal>}
                {// Show message if user tries to like an image that is already in user account
                LikedObj && 
                <Modal show={setLikedObj} onHide={handleClose}>
                    <Modal.Header>
                        You have already liked this image.
                    </Modal.Header>
                </Modal>}
                {/* If the media is an image, render it using Image attribute.
                    If media is a video, display the video*/}
                { resp.media_type === "image" ? <GeneratedImg /> : <GeneratedVid /> }
                {liked ? <LikedBtn src={like_icon} /> : <LikeBtn src={star_icon} /> }
                <Accordion defaultActiveKey={['0']} alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header><strong>Description</strong></Accordion.Header>
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
                <a href="https://apod.nasa.gov/apod/archivepix.html" rel="image-source" target="_blank" id="src_link">Image Source</a>
            </div>
    );
}
