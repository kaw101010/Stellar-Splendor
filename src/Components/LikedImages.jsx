import { getDatabase, get, ref, remove } from "firebase/database";
import { useState, useEffect } from "react";
import { Button, Card, Image, Offcanvas } from "react-bootstrap";
import "../App.css";
import { Link } from "react-router-dom";

const MediaComponent = ({type, url}) => {
    if (type === "image") {
        return (
            <Image src={url} height={"600px"} className="liked_image" />
        );
    } else {
        return (
            <iframe src={url} height={"600px"} />
        )
    }
}

const CardGenerator = ({element, user}) => {
    // Generates a card for every image/video
    const [show, setShow] = useState(false);

    const handleClose = () => {setShow(false)};
    const handleShow =() => {setShow(true)};
    return (
        <Card>
            <MediaComponent url={element.media_url} type={element.media_type} />
            <Card.Body>
                <Card.Title>
                    {element.media_title}
                </Card.Title>
                <Button variant="outline-dark" className="unlike_image" onClick={() => {
                    // Remove image from user account
                    const db = getDatabase();
                    const bucket = user?.email.replace(/[#@.]/g, "*");
                    const UserRef = ref(db, "users/" + bucket + "/" + element.randomID);
                    remove(UserRef);
                }}>Remove from Liked</Button>
                <Button variant="dark" className="desc_liked_image" onClick={handleShow}>Learn More</Button>
                <Offcanvas show={show} onHide={handleClose} placement="bottom">
                    <Offcanvas.Header closeButton={true}>
                        <Offcanvas.Title>{element.media_title}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {element.media_description}
                    </Offcanvas.Body>
                </Offcanvas>
            </Card.Body>
        </Card>
    )
}

const RetrieveImages = (({user}) => {
    const db = getDatabase();
    const [ImagesObj, setImagesObj] = useState(null);
    const [dataExists, setDataExists] = useState(false);
    const userEmail = user?.email;
    const UserKey = userEmail?.replace(/[@#.]/g, "*");

    const UserRef = ref(db, "users/" + UserKey);
    useEffect(() => {
        const retrieveData = async () => {
            try {
                const snapshot = await get(UserRef);
                if (snapshot.exists()) {
                    setImagesObj(snapshot.val());
                    setDataExists(true);
                } else {
                    setDataExists(false);
                }
            } catch (err) {
                setDataExists(false);
            }
        };

            retrieveData();
        }, [UserRef]);
        // When user prop is passed down, UserRef will be located and when that changes, retrieveData function will run

    return (
        <>
            {/* Render the media urls if there are images which have been liked, 
            Else display no liked images message */}
            <Link to={"/"}>
                <Button variant="light" className="profile_back" size="lg">Go Back</Button>
            </Link>
            {!dataExists && <h1 style={{color: "white", textAlign: "center"}}>No liked Images</h1>}
            {dataExists && ImagesObj && Object.values( ImagesObj ).map((ele, ind) => (
                <CardGenerator element={ele} user={user} key={ele.randomID} />
            ))}
        </>
    );
});

export default RetrieveImages;