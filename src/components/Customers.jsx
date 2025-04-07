import React, { useState, useContext } from "react";
import "./customers.css";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../App";
import Products from "./Products";
import Profile from "./Profile";
import { useTranslation } from "react-i18next";

function Customers() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(false);
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const { user, logout, db, app, unsubscribeRef } = useContext(AuthContext);
  const { t } = useTranslation();

  const loginWithEmail = (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      return alert(`${t("customersAlertEmail")}`);
    }
    if (password.length < 6) {
      return alert(`${t("customersAlertPassword")}`);
    }
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
    setEmail("");
    setPassword("");
  };
  const isEmail = (email) => {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  };

  return (
    <>
      {user ? (
        <div className="customers-auth">
          <div className="customers-block-info">
            <div className="customers-authtext">
              {t("customersGreeteng")}
              {user.email}
            </div>
            <button onClick={() => setProfile(!profile)} className="customers-btnlogout">
              {t("profile")}
            </button>
            <button
              className="customers-btnlogout"
              onClick={() => {
                logout();
              }}
            >
              {t("customersLogOut")}
            </button>
          </div>
          {profile ? (
            <>
              <Profile db={db} />
              <div className="customers-profile-block-btn-profile">
                <button onClick={() => setProfile(false)} className="customers-btnlogout">
                  {t("cancel")}
                </button>
              </div>
            </>
          ) : (
            <div className="customers-block-products">
              <Products db={db} app={app} auth={auth} unsubscribeRef={unsubscribeRef} />
            </div>
          )}

          <div className="customers-meinblock"></div>
        </div>
      ) : (
        <>
          <div className="customers">
            <div className="customers-info-container ">
              <div className="customers-info">{t("customers")}</div>
              <div className="customers-info">{t("customers1")}</div>
              <div className="customers-info">{t("customers2")}</div>
            </div>
            <form className="customers-block-registerWithMail">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("customersPlaceholderEmail")}
                className="inputMail"
              ></input>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("customersPlaceholderPassword")}
                type="password"
                className="inputPassword"
              ></input>
              <button
                onClick={(e) => {
                  loginWithEmail(e);
                }}
                className="btn-submit"
                type="submit"
              >
                {t("login")}
              </button>
              <div className="customers-block-registration">
                <Link className="btn-registration" to="/registration">
                  {t("registration")}
                </Link>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default Customers;
