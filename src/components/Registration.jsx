import React, { useState } from "react";
import "./registration.css";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();
  const registrationWithEmail = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      return alert("Passwords don't match");
    }
    if (password.length < 6) {
      return alert("Your password should be no less then 6 symbols");
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
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
          placeholder="Type your mail"
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
        <button
          onClick={(e) => {
            registrationWithEmail(e);
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
