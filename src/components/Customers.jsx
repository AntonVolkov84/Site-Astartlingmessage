import React, { useState } from "react";
import "./customers.css";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Customers({ app, db }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  const loginWithEmail = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    setEmail("");
    setPassword("");
  };

  return (
    <div className="customers">
      <div className="customers-info">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo necessitatibus, nesciunt quod magnam eveniet vero,
        aperiam perferendis dolorem, provident odio officiis modi sapiente dignissimos distinctio ut voluptate illo
        libero voluptatum?
      </div>
      <form className="customers-block-registerWithMail">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your mail"
          className="inputMail"
        ></input>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type your password"
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
          Login
        </button>
        <Link className="btn-registration" to="/registration">
          Registration
        </Link>
      </form>
    </div>
  );
}

export default Customers;