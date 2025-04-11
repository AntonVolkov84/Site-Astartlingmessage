import React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

function Header() {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const { t } = useTranslation();
  return (
    <header className="header">
      <div className="header-text">A startling message</div>
      <img src="smile.png" alt="logo" className="header-logo-conf"></img>
      <img src="smileWithHand.png" alt="logo" className="header-logo"></img>
      <div className="header-menu">
        <NavLink to="/" className={({ isActive }) => (isActive ? "menu-home-active" : "menu-home")}>
          <h3 className="header-href">{t("headerHome")}</h3>
        </NavLink>
        <NavLink to="payments" className={({ isActive }) => (isActive ? "menu-home-active" : "menu-home")}>
          <h3 className="header-href">{t("headerPayments")}</h3>
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "menu-confidential-active" : "menu-confidential")}
          to="confidential"
        >
          <h3 className="header-href">{t("headerConfidential")}</h3>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "menu-customers-active" : "menu-customers")} to="customers">
          <h3 className="header-href">{t("headerCustomers")}</h3>
        </NavLink>
      </div>
      <div className="header-block-language">
        <button onClick={() => changeLanguage("ru")} className="header-language-text">
          Русский
        </button>
        <button onClick={() => changeLanguage("en")} className="header-language-text">
          English
        </button>
      </div>
    </header>
  );
}

export default Header;
