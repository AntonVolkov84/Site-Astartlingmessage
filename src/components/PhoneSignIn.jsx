import React, { useState, useEffect } from "react";
import "./phoneSignIn.css";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useTranslation } from "react-i18next";

function PhoneSignIn({ setPhoneRegistrationComplite, setUserPhone }) {
  const [phone, setPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const auth = getAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const initializeRecaptcha = () => {
      if (!window.recaptchaVerifier) {
        try {
          const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "normal",
            callback: (response) => {},
            "expired-callback": () => {
              alert(`${t("phoneSignInRecapthcaAlert")}`);
              recaptchaVerifier.reset();
              initializeRecaptcha();
            },
          });
          recaptchaVerifier.render().then((widgetId) => {
            setRecaptchaLoaded(true);
          });
          window.recaptchaVerifier = recaptchaVerifier;
        } catch (error) {
          console.error("Error initializing RecaptchaVerifier:", error);
        }
      }
    };

    initializeRecaptcha();
  }, [auth]);

  const handlePhoneVerification = async () => {
    setUserPhone(phone);
    if (!recaptchaLoaded) {
      alert(`${t("phoneSignInRecapthcaAlertNotLoading")}`);
      return;
    }
    const recaptchaVerifier = window.recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
      setConfirmationResult(result);
      alert(`${t("phoneSignInrecaptchaVerifierAlert")}`);
    } catch (error) {
      console.error("Error during phone verification:", error);
      if (error.code === "auth/network-request-failed") {
        alert("Network error occurred. Please try again.");
      } else if (error.code === "auth/invalid-phone-number") {
        alert("Invalid phone number. Please check your number and try again.");
      } else {
        alert("An error occurred during phone verification. Please try again.");
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      await confirmationResult.confirm(confirmPhone);
      setConfirmPhone("");
      setPhoneRegistrationComplite(true);
    } catch (error) {
      console.error("Error verifying code:", error);
      alert(`${t("phoneSignHandleVerifyCodeAlert")}`);
    }
  };

  return (
    <div className="phonesignin">
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={t("phoneSignPlaceholderPhone")}
        type="tel"
        className="registration-inputPassword"
      ></input>
      <div id="recaptcha-container"></div>
      <button type="button" onClick={handlePhoneVerification} className="registration-btn-submit">
        {t("phoneSignSendVerification")}
      </button>
      {confirmationResult && (
        <div>
          <input
            value={confirmPhone}
            onChange={(e) => setConfirmPhone(e.target.value)}
            placeholder={t("phoneSignPlaceholderConfirmPhone")}
            className="registration-inputPassword"
          ></input>
          <button type="button" onClick={handleVerifyCode} className="registration-btn-submit">
            {t("phoneSignVerify")}
          </button>
        </div>
      )}
    </div>
  );
}

export default PhoneSignIn;
