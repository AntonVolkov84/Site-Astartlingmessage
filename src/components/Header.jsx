import React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-text">A startling message</div>
      <img src="smile.png" alt="logo" className="header-logo-conf"></img>
      <img src="smileWithHand.png" alt="logo" className="header-logo"></img>
      <div className="header-menu">
        <NavLink to="/" className={({ isActive }) => (isActive ? "menu-home-active" : "menu-home")}>
          <h2 className="header-href">Home</h2>
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? "menu-confidential-active" : "menu-confidential")}
          to="confidential"
        >
          <h2 className="header-href">Confidential</h2>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "menu-customers-active" : "menu-customers")} to="customers">
          <h2 className="header-href">Customers</h2>
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
