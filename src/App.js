import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import React, { createContext, useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Customers from "./components/Customers";
import Confidential from "./components/Confidential";
import { Suspense } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Registration from "./components/Registration";
import { GeoFirestore } from "geofirestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6RB8iNw7-CXgS1GOkGScHK63RJuiMTIQ",
  authDomain: "a-startling-message-de67b.firebaseapp.com",
  projectId: "a-startling-message-de67b",
  storageBucket: "a-startling-message-de67b.firebasestorage.app",
  messagingSenderId: "899594134591",
  appId: "1:899594134591:web:4d67a7ff8fde74a41f448a",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const geoFirestore = new GeoFirestore(db);
export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const unsubscribeRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.emailVerified) {
          return alert("Please, verified your email");
        }
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    signOut(auth)
      .then(async () => {
        setUser(null);
        localStorage.removeItem("user");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <Suspense fallback="loading">
      <BrowserRouter>
        <div className="App">
          <AuthContext.Provider value={{ user, logout, db, app, unsubscribeRef, geoFirestore }}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="customers" element={<Customers />} />
                <Route path="confidential" element={<Confidential />} />
                <Route path="registration" element={<Registration app={app} db={db} />} />
              </Route>
            </Routes>
          </AuthContext.Provider>
        </div>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
