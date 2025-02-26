import React, { useState, useContext } from "react";
import "./registration.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import MapWindow from "./MapWindow";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import PhoneSignIn from "./PhoneSignIn";
import * as geofire from "geofire-common";

function Registration() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneRegistrationComplete, setPhoneRegistrationComplite] = useState(false);
  const [location, setLocation] = useState(null);
  const { db } = useContext(AuthContext);
  const auth = getAuth();
  const navigate = useNavigate();

  const clearState = () => {
    setEmail("");
    setCompanyName("");
    setPassword("");
    setPasswordConfirm("");
    setLocation(null);
    setUserPhone("");
  };

  const handleLocationSelect = (location) => {
    setLocation(location);
  };

  const verificationData = (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      return alert("Something wrong in your email");
    }
    if (!email || !companyName || !password || !passwordConfirm) {
      return alert("Some field is empty!");
    }
    if (companyName.length < 2) {
      return alert("Name of company should be longer than 2 symbols");
    }
    if (password !== passwordConfirm) {
      return alert("Passwords don't match");
    }
    if (password.length < 6) {
      return alert("Your password should be no less than 6 symbols");
    }
    if (!location) {
      return alert("Select your location on the map");
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
        companyName,
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
        timestamp: serverTimestamp(),
        nikname: companyName,
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
            alert("You may receive a mail with a link for authorization");
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
      {phoneRegistrationComplete ? (
        <form className="registration-form">
          <input
            value={email}
            type="email"
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
            Register
          </button>
        </form>
      ) : (
        <PhoneSignIn setPhoneRegistrationComplite={setPhoneRegistrationComplite} setUserPhone={setUserPhone} />
      )}
    </div>
  );
}

export default Registration;
