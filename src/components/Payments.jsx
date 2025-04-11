import React, { useState, useEffect, useContext } from "react";
import "./payments.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

export default function Payments() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const isEmail = (email) => {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  };
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
  return (
    <section className="payments">
      {currentUser ? (
        <div className="payments-block-info">
          <div className="payments-authtext">
            {t("customersGreeteng")}
            {currentUser.email}
          </div>
          <button
            className="payments-btnlogout"
            onClick={() => {
              logout();
            }}
          >
            {t("customersLogOut")}
          </button>
        </div>
      ) : (
        <div className="payments-block-login">
          <h3 className="payments-block-login-title">You must to login for refull youy account</h3>
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
      )}
    </section>
  );
}
