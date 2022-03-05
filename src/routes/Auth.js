import AuthForm from "components/AuthForm";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { authService } from "myFirebase";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import 'auth.css'

const Auth = () => {
    // google, github으로 로그인
    const onSocialClick = async (event) => {
        const {
            target: {name}
        } = event;
        let provider;
        if(name === "google"){
             provider = new GoogleAuthProvider();
        } else if(name === "github"){
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
    }
    return (
      <div className="authContainer">
        <FontAwesomeIcon className="authMainIcon" icon={faTwitter} size="3x"/>
        <AuthForm />
        <div className="authBtns">
          <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} /></button>
          <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} /></button>
        </div>
      </div>
    )
}
export default Auth