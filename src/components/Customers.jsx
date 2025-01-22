import React, { useState, useContext } from "react";
import "./customers.css";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../App";
import Products from "./Products";

function Customers() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const { user, logout, db, app, unsubscribeRef } = useContext(AuthContext);

  const loginWithEmail = (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      return alert("Something wrong in your email");
    }
    if (password.length < 6) {
      return alert("Your password should be longer then 6 symbols");
    }
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
    setEmail("");
    setPassword("");
  };
  const isEmail = (email) => {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  };

  return (
    <>
      {user ? (
        <div className="customers-auth">
          <div className="customers-block-info">
            <div className="customers-authtext">Welcome in customer interface {user.email}</div>
            <button
              className="customers-btnlogout"
              onClick={() => {
                logout();
              }}
            >
              Log out
            </button>
          </div>
          <div className="customers-block-products">
            <Products db={db} app={app} auth={auth} unsubscribeRef={unsubscribeRef} />
          </div>
          <div className="customers-meinblock"></div>
        </div>
      ) : (
        <div className="customers">
          <div className="customers-info">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo necessitatibus, nesciunt quod magnam eveniet
            vero, aperiam perferendis dolorem, provident odio officiis modi sapiente dignissimos distinctio ut voluptate
            illo libero voluptatum?
          </div>
          <form className="customers-block-registerWithMail">
            <input
              type="email"
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
            <div className="customers-block-registration">
              <Link className="btn-registration" to="/registration">
                Registration
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Customers;
