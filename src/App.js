import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import SomeInfo from "./components/SomeInfo";
import Customers from "./components/Customers";
import Confidential from "./components/Confidential";
import { Suspense } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Registration from "./components/Registration";

const firebaseConfig = {
  apiKey: "AIzaSyDfJfOIoEjz7LsL-G2VafThBMRYCXvl-jI",
  authDomain: "a-startling-message.firebaseapp.com",
  projectId: "a-startling-message",
  storageBucket: "a-startling-message.firebasestorage.app",
  messagingSenderId: "784492008154",
  appId: "1:784492008154:web:f172e6caedf9b048338be3",
  measurementId: "G-KS8ZE1PKX3",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

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
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
        console.log("User signed out.");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <Suspense fallback="loading">
      <BrowserRouter>
        <div className="App">
          <AuthContext.Provider value={{ user, logout }}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="info" element={<SomeInfo />} />
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
