import React, { useState, useEffect, useContext } from "react";
import "./payments.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import { doc, onSnapshot } from "firebase/firestore";
import logo from "../images/horizontal logos.png";

export default function Payments() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const { t } = useTranslation();
  const { logout, db, user } = useContext(AuthContext);
  const auth = getAuth();
  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    if (currentUserEmail) {
      const unsubUser = onSnapshot(doc(db, "users", auth.currentUser.email), (doc) => {
        setUserData(doc.data());
      });

      return () => unsubUser();
    }
  }, [currentUserEmail]);
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
      {user ? (
        <>
          {userData ? (
            <>
              <div className="payments-block-info">
                <div className="payments-authtext">
                  {t("paymentsGreeteng")}
                  {currentUserEmail}
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
              <div className="payments-logos">
                <img className="payments-logos-item" src={logo} alt="logo payservice"></img>
              </div>
              <div className="payments-block-form">
                <h4 className="payments-form-text">
                  {t("profile")}: {userData.email || "Wait..."}
                </h4>
                <h4 className="payments-form-text">
                  {t("paymentsAmmount")} {userData.userAccount || 0}
                </h4>
                <h4 className="payments-form-text">{t("paymentsTitle")}</h4>
              </div>
              <iframe
                title="Пополнение счета"
                src="https://demo.paykeeper.ru/form/"
                style={{ width: "100%", height: "820px" }}
              ></iframe>
            </>
          ) : (
            <p className="payment-loading">Loading...</p>
          )}
        </>
      ) : (
        <div className="payments-block-login">
          <h3 className="payments-block-login-title">{t("paymentInfo")}</h3>
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
          <h2 className="payments-return-title">{t("paymentReturnTitile")}</h2>
          <h4 className="payments-return-info">{t("paymentReturn")}</h4>
          <ul>
            <li className="payments-return-items">{t("paymentReturn1")}</li>
            <li className="payments-return-items">{t("paymentReturn2")}</li>
            <li className="payments-return-items">{t("paymentReturn3")}</li>
            <li className="payments-return-items">{t("paymentReturn4")}</li>
          </ul>
          <h2 className="payments-return-title">{t("paymentCencellationTitle")}</h2>
          <h4 className="payments-return-info">{t("paymentCencellation")}</h4>
          <ul>
            <li className="payments-return-items">{t("paymentCencellation1")}</li>
            <li className="payments-return-items">
              {t("paymentCencellation2")}
              <ul>
                <li className="payments-return-items">{t("paymentCencellation21")}</li>
                <li className="payments-return-items">{t("paymentCencellation22")}</li>
                <li className="payments-return-items">{t("paymentCencellation23")}</li>
              </ul>
            </li>
            <li className="payments-return-items">{t("paymentCencellation3")}</li>
            <li className="payments-return-items">{t("paymentCencellation4")}</li>
          </ul>
        </div>
      )}
    </section>
  );
}
