import React from "react";
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import 'navigation.css'
const Navigation = ({ userObj }) => (
<nav>
    <ul className="navigator">
        <li><Link to="/" className="home">
            <FontAwesomeIcon className="icon" icon={faTwitter} color={"#04AAFF"} size="2x"/>
            Home
            </Link></li>
        <li><Link to="/profile" className="profile">
                <FontAwesomeIcon className="icon" icon={faUser} color={"#04AAFF"} size="2x"/>
            {userObj.displayName ? `${userObj.displayName}의 Profile`:"Profile"}</Link></li>
    </ul>
</nav>)
export default Navigation