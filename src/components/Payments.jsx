import React, { useState, useEffect, useContext } from "react";
import "./payments.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import { doc, onSnapshot } from "firebase/firestore";
import axios from "axios";

export default function Payments() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ammount, setAmmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [userData, setUserData] = useState(null);
  const { t } = useTranslation();
  const { logout, db, user } = useContext(AuthContext);
  const auth = getAuth();
  const currentUserEmail = auth.currentUser?.email;

  const clearInputs = () => {
    setAmmount("");
    setCardNumber("");
    setExpiryDate("");
    setCvc("");
  };
  useEffect(() => {
    if (currentUserEmail) {
      const unsubUser = onSnapshot(doc(db, "users", auth.currentUser.email), (doc) => {
        setUserData(doc.data());
      });

      return () => unsubUser();
    }
  }, [currentUserEmail]);

  const checkAmound = (ammound) => {
    if (cvc.length <= 4) {
      return true;
    } else {
      alert(`${t("paymentAlertAmound")}`);
      return false;
    }
  };
  const checkCardNumber = (number) => {
    const trimmedNumber = number.replace(/\s+/g, "");
    if (trimmedNumber.length === 16) {
      return true;
    } else {
      alert(`${t("paymentAlertCardNumber")}`);
      return false;
    }
  };
  const checkExpiryDate = (expiryDate) => {
    if (expiryDate.length == 4) {
      return true;
    } else {
      alert(`${t("paymentAlertExpiryDate")}`);
      return false;
    }
  };
  const checkCvc = (cvc) => {
    if (cvc.length == 3) {
      return true;
    } else {
      alert(`${t("paymentAlertCvc")}`);
      return false;
    }
  };

  const sendPayment = async () => {
    const paymentData = {
      ammount,
      cardNumber,
      expiryDate,
      cvc,
    };
    clearInputs();
    if (
      checkAmound(paymentData.ammount) &&
      checkCardNumber(paymentData.cardNumber) &&
      checkExpiryDate(paymentData.expiryDate) &&
      checkCvc(paymentData.cvc)
    ) {
      try {
        const result = await axios.post(`https://stroymonitoring.info/test`, paymentData);
        return result;
      } catch (error) {
        console.log("sendPayment", error.message);
      }
    }
  };
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
  const formatCardNumber = (number) => {
    return number
      .replace(/\s?/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };
  const handleCardNumberChange = (e) => {
    const rawValue = e.target.value.replace(/\s/g, "");
    if (/^\d*$/.test(rawValue)) {
      setCardNumber(formatCardNumber(rawValue));
    }
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
              <div className="payments-block-form">
                <h4 className="payments-form-text">
                  {t("profile")} {userData.email}
                </h4>
                <h4 className="payments-form-text">
                  {t("paymentsAmmount")} {userData.userAccount || 0}
                </h4>
                <h4 className="payments-form-text">{t("paymentsTitle")}</h4>
              </div>
              <div className="credit-card-form">
                <div className="card-display">
                  <div className="card-number">{cardNumber || "•••• •••• •••• ••••"}</div>
                  <div className="card-expiry">{expiryDate || "MM/YY"}</div>
                  <div className="card-cvc">{cvc || "•••"}</div>
                </div>
                <form>
                  <div className="input-group">
                    <label>Ammount</label>
                    <input
                      type="text"
                      value={ammount}
                      onChange={(e) => setAmmount(e.target.value)}
                      placeholder="100.00"
                    />
                  </div>
                  <div className="input-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="input-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="input-group">
                    <label>CVC</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                    />
                  </div>
                </form>
                <button
                  onClick={() => {
                    sendPayment();
                  }}
                  className="payments-submit"
                >
                  {t("submit")}
                </button>
              </div>
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
        </div>
      )}
    </section>
  );
}
