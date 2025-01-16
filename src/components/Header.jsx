import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-text">A startling message</div>
      <div className="header-menu">
        <Link className="menu-home" to="/">
          <h2 className="header-href">Home</h2>
        </Link>
        <Link className="menu-info" to="info">
          <h2 className="header-href">Info</h2>
        </Link>
        <Link className="menu-info" to="confidential">
          <h2 className="header-href">Confidential</h2>
        </Link>
        <Link className="menu-customers" to="customers">
          <h2 className="header-href">Customers</h2>
        </Link>
      </div>
    </header>
  );
}

export default Header;
