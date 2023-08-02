import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";

const Profile = (({userImage, userName, userEmail}) => {
    // Render the profile
    return (<div className="user_profile">
                <Image src={userImage} alt="profile photo" className="profile_img" roundedCircle={true} ></Image>
                <h1 className="profile_name">{userName}</h1>
                <p>{userEmail}</p>
            </div>
    );
});

const UserProfile = (({user}) => {
    let username="";
    {/* Add case if user has no display name.
    Github provider might not provide a displayName, 
    so a screenName is being used instead */}
    if (!(user?.displayName)) {
        username = user?.reloadUserInfo?.screenName;
    } else {
        username = user?.displayName;
    }
    return (
        <>
            <Link to={"/"}>
                <Button variant="light" className="profile_back" size="lg">Go Back</Button>
            </Link>
            <Profile userImage={user?.photoURL} userName={username} userEmail={user?.email} />
        </>
    )
});

export default UserProfile;