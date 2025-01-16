import React, { useState, useContext } from "react";
import "./registration.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import MapWindow from "./MapWindow";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

function Registration() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [location, setLocation] = useState(null);
  const { app, db } = useContext(AuthContext);
  const auth = getAuth();
  const navigate = useNavigate();
  const clearState = () => {
    setEmail("");
    setCompanyName("");
    setPassword("");
    setPasswordConfirm("");
    setLocation(null);
  };
  const handleLocationSelect = (location) => {
    setLocation(location);
  };
  const verificationData = (e) => {
    e.preventDefault();
    if (!email || !companyName || !password || !passwordConfirm) {
      return alert("Some field is empty!");
    }
    if (companyName.length < 2) {
      return alert("Name of company should be longer than 2 symbol");
    }
    if (password !== passwordConfirm) {
      return alert("Passwords don't match");
    }
    if (password.length < 6) {
      return alert("Your password should be no less then 6 symbols");
    }
    if (!location) {
      return alert("Select your location on the map");
    } else {
      registrationWithEmail();
      addToCustomer(email, companyName, location);
      clearState();
    }
  };
  const addToCustomer = async (email, companyName, location) => {
    const emailInLowerCase = email.toLowerCase();
    try {
      const user = {
        timestamp: serverTimestamp(),
        email: emailInLowerCase,
        companyName,
        location,
      };
      await setDoc(doc(db, "customers", emailInLowerCase), user);
    } catch (error) {
      console.log("add to users", error);
    }
  };
  const registrationWithEmail = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user.uid) {
          sendEmailVerification(auth.currentUser).then(() => {
            alert("You may recived a mail with link for authorization");
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

  return (
    <div className="registration">
      <form className="registration-form">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your email"
          className="registration-inputMail"
        ></input>
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Type name of your company"
          className="registration-inputMail"
        ></input>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type your password"
          type="password"
          className="registration-inputPassword"
        ></input>
        <input
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Confirm your password"
          type="password"
          className="registration-inputPassword"
        ></input>
        <div>
          <h3 className="registration-locationtext">Select your location</h3>
          <MapWindow onLocationSelect={handleLocationSelect} />
          {location && (
            <div>
              <h2>Selected Location:</h2>
              <p>Latitude: {location.lat}</p>
              <p>Longitude: {location.lng}</p>
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
          Login
        </button>
      </form>
    </div>
  );
}

export default Registration;
