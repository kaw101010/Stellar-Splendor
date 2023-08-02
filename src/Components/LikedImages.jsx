import { getDatabase, get, ref } from "firebase/database";
import React, { useState, useEffect } from "react";
import "../App.css";

const RetrieveImages = (({user}) => {
    const db = getDatabase();
    const [ImagesObj, setImagesObj] = useState([]);
    const [dataExists, setDataExists] = useState(true);
    const userEmail = user.email;
    const UserKey = userEmail.replace(/[@#.]/g, "*");

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
                    console.log("no data available");
                }
            } catch (err) {
                console.log(err);
            }
        };
    
            retrieveData();
        }, [UserRef]);
        // When user prop is passed down, UserRef will be located and when that changes, retrieveData function will run

    console.log("entered new path");
    return (
        <>
            {/* Render the media urls if there are images which have been liked, 
            Else display no liked images message */}
            {!dataExists && <h1 style={{color: "white"}}>No liked Images</h1>}
            {ImagesObj && Object.values( ImagesObj ).map((ele, ind) => (
                <h1 key={ind} style={{color: "white"}}>{ele.media_url}</h1>
            ))}
        </>
    );
});

export default RetrieveImages;