import React, { useState, useEffect } from "react";
import "./phoneSignIn.css";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function PhoneSignIn({ setPhoneRegistrationComplite, setUserPhone }) {
  const [phone, setPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const initializeRecaptcha = () => {
      if (!window.recaptchaVerifier) {
        try {
          const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "normal",
            callback: (response) => {
              console.log("reCAPTCHA решена:", response);
            },
            "expired-callback": () => {
              alert("Recaptcha expired! Please solve it again.");
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
      alert("reCAPTCHA is not loaded yet. Please wait.");
      return;
    }
    const recaptchaVerifier = window.recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
      setConfirmationResult(result);
      alert("SMS sent. Please enter the verification code.");
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
      alert("Invalid verification code. Please try again.");
    }
  };

  return (
    <div className="phonesignin">
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Type your phone number"
        type="tel"
        className="registration-inputPassword"
      ></input>
      <div id="recaptcha-container"></div>
      <button type="button" onClick={handlePhoneVerification} className="registration-btn-submit">
        Send Verification Code
      </button>
      {confirmationResult && (
        <div>
          <input
            value={confirmPhone}
            onChange={(e) => setConfirmPhone(e.target.value)}
            placeholder="Code from SMS"
            className="registration-inputPassword"
          ></input>
          <button type="button" onClick={handleVerifyCode} className="registration-btn-submit">
            Verify Code
          </button>
        </div>
      )}
    </div>
  );
}

export default PhoneSignIn;
