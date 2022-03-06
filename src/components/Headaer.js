import React from "react";
import 'header.css'
const Header = () => {
    
    return (
        <div className="header-container">
            <h1 className="header-title">My Little Sociery</h1>
            <img className="header-image" src={require("img/header.png")} />
        </div>
    );
}

export default Header