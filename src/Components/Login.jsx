import app from "./firebaseInit.jsx";
import { signInWithPopup, GoogleAuthProvider, getAuth, GithubAuthProvider } from "firebase/auth";
import { Button } from "react-bootstrap";
import google_icon from "../assets/google-icon.svg";
import github_icon from "../assets/github-icon.svg";

const Login = () => {

    return (
        <nav className="login_methods">
            <Button variant="outline-primary" className="popup_btn" size="lg" onClick={(e) => {
                e.preventDefault()
                const provider = new GoogleAuthProvider();
                const auth = getAuth(app);

                signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;
                    console.log(result);
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    const email = error.customData.email;
                    const credential = GoogleAuthProvider.credentialFromError(error);
                });
                }}><img src={google_icon} alt="google login btn" height={"30px"}></img>Login with Google</Button>

                <Button variant="outline-primary" className="popup_btn" size="lg"
                    onClick={(e) => {
                        e.preventDefault()
                        const provider = new GithubAuthProvider();
                        const auth = getAuth();

                        signInWithPopup(auth, provider)
                        .then((result) => {
                            const credential = GithubAuthProvider.credentialFromResult(result);
                            const token = credential.accessToken;
                            const user = result.user;
                        }).catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            const email = error.customData.email;
                            const credential = GithubAuthProvider.credentialFromError(error);
                        });
                    }} >
                    <img src={github_icon} alt="github login btn" height={"30px"}></img>
                    Login with Github
                </Button>
    </nav>
    )
}

export default Login;