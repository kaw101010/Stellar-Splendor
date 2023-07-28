import React, { useEffect } from "react";
import "../App.css";

const Profile = (({userImage, userName}) => {
    return (<div className="user_profile">
                <h1 className="profile_name">{userName}</h1>
                <img src={userImage} alt="profile photo"></img>
            </div>
    );
});

const UserProfile = (({user}) => {
    return (
        user ? <Profile userImage={user?.photoURL} userName={user?.displayName} /> : null
    )
});

export default UserProfile;