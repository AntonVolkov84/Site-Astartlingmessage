import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import SomeInfo from "./components/SomeInfo";
import Customers from "./components/Customers";
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

function App() {
  return (
    <Suspense fallback="loading">
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="info" element={<SomeInfo />} />
              <Route path="customers" element={<Customers />} />
              <Route path="registration" element={<Registration app={app} db={db} />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
