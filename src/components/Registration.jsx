import React, { useState, useContext } from "react";
import "./registration.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import MapWindow from "./MapWindow";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "firebase/compat/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import PhoneSignIn from "./PhoneSignIn";
import * as geofire from "geofire-common";
import TelegrammBot from "./TelegrammBot";
import { useTranslation } from "react-i18next";

function Registration() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [chatId, setChatId] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [startWorkingTime, setStartWorkingTime] = useState("");
  const [endWorkingTime, setEndWorkingTime] = useState("");
  const [phoneRegistrationComplete, setPhoneRegistrationComplite] = useState(false);
  const [telegrammBotGettingChatId, setTelegrammBotGettingChatId] = useState(true);
  const [location, setLocation] = useState(null);
  const { db } = useContext(AuthContext);
  const { t } = useTranslation();
  const auth = getAuth();
  const navigate = useNavigate();

  const clearState = () => {
    setEmail("");
    setCompanyName("");
    setPassword("");
    setPasswordConfirm("");
    setLocation(null);
    setUserPhone("");
    setChatId(null);
    setStartWorkingTime("");
    setEndWorkingTime("");
  };

  const handleLocationSelect = (location) => {
    setLocation(location);
  };

  const verificationData = (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      return alert(`${t("registrationVerificationDataAlertEmail")}`);
    }
    if (!email || !companyName || !password || !passwordConfirm || !startWorkingTime || !endWorkingTime) {
      return alert(`${t("registrationVerificationDataAlertFields")}`);
    }
    if (companyName.length < 2) {
      return alert(`${t("registrationVerificationDataAlertCompany")}`);
    }
    if (password !== passwordConfirm) {
      return alert(`${t("registrationVerificationDataAlertPassword")}`);
    }
    if (password.length < 6) {
      return alert(`${t("registrationVerificationDataAlertPasswordLength")}`);
    }
    if (endWorkingTime - startWorkingTime <= 0) {
      return alert(`${t("registrationVerificationDataTime")}`);
    }
    if (!location) {
      return alert(`${t("registrationVerificationDataAlertLocation")}`);
    } else {
      registrationWithEmail();
    }
  };

  const isEmail = (email) => {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  };

  const addToCustomer = async (email, companyName, location) => {
    const emailInLowerCase = email.toLowerCase();
    const lat = location.lat;
    const lng = location.lng;
    const hash = geofire.geohashForLocation([lat, lng]);
    try {
      const user = {
        timestamp: serverTimestamp(),
        email: emailInLowerCase,
        telegrammChatId: chatId,
        companyName,
        startWorkingTime,
        endWorkingTime,
        geohash: hash,
        location: {
          lat: lat,
          lng: lng,
        },
      };
      await setDoc(doc(db, "customers", emailInLowerCase), user);
    } catch (error) {
      console.log("addToCustomers", error);
    }
  };
  const addToUsers = async (email, userPhone, companyName, user) => {
    const emailInLowerCase = email.toLowerCase();
    const userId = user.uid;
    try {
      const user = {
        language: "en",
        telegrammChatId: chatId,
        timestamp: serverTimestamp(),
        nikname: companyName,
        startWorkingTime,
        endWorkingTime,
        email: emailInLowerCase,
        userId: userId,
        phoneNumber: userPhone,
      };
      await setDoc(doc(db, "users", emailInLowerCase), user);
    } catch (error) {
      console.log("add to users", error);
    }
  };
  const registrationWithEmail = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        addToCustomer(email, companyName, location);
        addToUsers(email, userPhone, companyName, user);
        clearState();
        setPhoneRegistrationComplite(false);
        if (user.uid) {
          sendEmailVerification(auth.currentUser).then(() => {
            alert(`${t("registrationregistrationWithEmailAlert")}`);
          });
          navigate("/customers");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  const hours = Array.from({ length: 25 }, (_, i) => i);
  return (
    <div className="registration">
      {phoneRegistrationComplete ? (
        <form className="registration-form">
          {telegrammBotGettingChatId ? (
            <TelegrammBot
              userPhone={userPhone}
              setChatId={setChatId}
              setTelegrammBotGettingChatId={setTelegrammBotGettingChatId}
            />
          ) : (
            <>
              <input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("registrationPlaceholderEmail")}
                className="registration-inputMail"
              ></input>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t("registrationPlaceholderCompany")}
                className="registration-inputMail"
              ></input>
              <select
                value={startWorkingTime}
                onChange={(e) => setStartWorkingTime(e.target.value)}
                placeholder={t("registrationPlaceholderStartTime")}
                className="registration-inputMail"
              >
                <option className="registration-time" value="" disabled selected hidden>
                  {t("registrationPlaceholderStartTime")}
                </option>
                {hours.map((hour) => (
                  <option className="registration-time" key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
              <select
                value={endWorkingTime}
                onChange={(e) => setEndWorkingTime(e.target.value)}
                className="registration-inputMail"
              >
                <option value="" disabled selected hidden>
                  {t("registrationPlaceholderEndTime")}
                </option>
                {hours.map((hour) => (
                  <option className="registration-time" key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("registrationPlaceholderPassword")}
                type="password"
                className="registration-inputPassword"
              ></input>
              <input
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder={t("registrationPlaceholderPasswordConfirm")}
                type="password"
                className="registration-inputPassword"
              ></input>

              <div>
                <h3 className="registration-locationtext">{t("registrationTextLocation")}</h3>
                <MapWindow onLocationSelect={handleLocationSelect} />
                {location && (
                  <div>
                    <h2>{t("registrationTextLocationMap")}</h2>
                    <p>
                      {t("registrationTextLocationMapLat")}
                      {location.lat}
                    </p>
                    <p>
                      {t("registrationTextLocationMapLon")}
                      {location.lng}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  verificationData(e);
                }}
                className="registration-btn-submit"
                type="submit"
              >
                {t("registration")}
              </button>
            </>
          )}
        </form>
      ) : (
        <PhoneSignIn setPhoneRegistrationComplite={setPhoneRegistrationComplite} setUserPhone={setUserPhone} />
      )}
    </div>
  );
}

export default Registration;
