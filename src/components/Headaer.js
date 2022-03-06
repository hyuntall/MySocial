import React from "react";
import 'header.css'
const Header = () => {
    
    return (
        <div className="header-container">
            <h1 className="header-title">My Little B612</h1>
            <img className="header-image" src={require("img/header.png")} />
        </div>
    );
}

export default Header