import app from "./firebaseInit.jsx";
import { signInWithPopup, GoogleAuthProvider, getAuth, GithubAuthProvider, fetchSignInMethodsForEmail } from "firebase/auth";
import { Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import google_icon from "../assets/google-icon.svg";
import github_icon from "../assets/github-icon.svg";
import { useEffect, useState } from "react";

const AccountLinkedError = () => {
    return (
        <Alert variant="danger" dismissible={true} id="account-linked-error">
            <Alert.Heading>Please sign in with Google!</Alert.Heading>
            <p>A Google Account already exists with this email</p>
        </Alert>
    )
}

const Login = ({user, setUser}) => {
    const nav = useNavigate();
    const [linkedAccount, isAccountLinked] = useState(false);

    useEffect(() => {
        if (user) {
            nav("/");
        }
    }, [user, nav]);

    return (
        <>
            { linkedAccount ? <AccountLinkedError /> : null}
            <nav className="login_methods">
                    <Button variant="outline-primary" className="popup_btn" size="lg" onClick={(e) => {
                        e.preventDefault()
                        const provider = new GoogleAuthProvider();
                        provider.setCustomParameters({prompt: "select_account"});
                        const auth = getAuth(app);
                            signInWithPopup(auth, provider)
                            .then((result) => {
                                const userProfile = result.user;
                                setUser(userProfile);
                                console.log(userProfile.displayName);
                                nav("/");
                            }).catch((error) => {
                                console.log(error);
                            });
                        }}><img src={google_icon} alt="google login btn" height={"30px"}></img>Login with Google</Button>

                        <Button variant="outline-primary" className="popup_btn" size="lg"
                            onClick={(e) => {
                                e.preventDefault()
                                const provider = new GithubAuthProvider();
                                const auth = getAuth();
                                signInWithPopup(auth, provider)
                                .then((result) => {
                                    const user = result.user;
                                    const isGoogleUser = user.email;
                                    setUser(user);
                                    nav("/");
                                }).catch((error) => {
                                    console.log(error);
                                    const email = error.customData.email
                                    fetchSignInMethodsForEmail(auth, email)
                                    .then((methods) => {
                                        if (methods.includes("google.com")) {
                                            isAccountLinked(true);
                                        }
                                    })
                                    .catch ((err) => {
                                        console.log(err);
                                    })
                                    
                                });
                            }} >
                            <img src={github_icon} alt="github login btn" height={"30px"}></img>
                            Login with Github
                        </Button>
                    </nav>
        </>
    )
}

export default Login;