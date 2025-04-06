import React, { useState, useEffect } from "react";
import "./profile.css";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import MapWindow from "./MapWindow";
import * as geofire from "geofire-common";
import edit from "../images/edit.png";

function Profile({ db }) {
  const [userData, setUserData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [modalNikname, setModalNikname] = useState(false);
  const [newNikname, setNewNikname] = useState("");
  const [location, setLocation] = useState(null);
  const auth = getAuth();
  const currentUserEmail = auth.currentUser.email;
  const { t } = useTranslation();

  useEffect(() => {
    const unsubUser = onSnapshot(doc(db, "users", currentUserEmail), (doc) => {
      setUserData(doc.data());
      setNewNikname(doc.data().nikname);
    });
    const unsubCustomer = onSnapshot(doc(db, "customers", currentUserEmail), (doc) => {
      setCustomerData(doc.data());
      setLocation(doc.data().location);
    });
    return () => {
      unsubUser();
      unsubCustomer();
    };
  }, []);
  const handleLocationSelect = (location) => {
    setLocation(location);
  };
  const updateNikname = async () => {
    try {
      const docRef = doc(db, "users", currentUserEmail);
      await updateDoc(docRef, {
        nikname: newNikname,
      });
    } catch (error) {
      console.log("updateNikname", error.message);
    }
  };
  const updateLocation = async () => {
    try {
      const docRef = doc(db, "customers", currentUserEmail);
      const lat = location.lat;
      const lng = location.lng;
      const hash = geofire.geohashForLocation([lat, lng]);
      await updateDoc(docRef, {
        geohash: hash,
        location: {
          lat: lat,
          lng: lng,
        },
      });

      setLocation("");
    } catch (error) {
      console.log("updateLocation", error);
    }
  };

  return (
    <div className="profile">
      {userData && customerData && (
        <>
          <div className="profile-info">
            <div className="profile-info-name">Email:</div>
            <div className="profile-info-text">{userData.email}</div>
          </div>
          <div className="profile-info">
            <div className="profile-info-name">Phone:</div>
            <div className="profile-info-text">{userData.phoneNumber}</div>
          </div>
          <div className="profile-info">
            <div className="profile-info-name">Nikname:</div>
            {modalNikname ? (
              <>
                <input
                  value={newNikname}
                  onChange={(e) => setNewNikname(e.target.value)}
                  className="profile-info-text-modal"
                  maxlength="20"
                ></input>
                <button
                  onClick={() => {
                    setModalNikname(false);
                    updateNikname();
                  }}
                  className="profile-info-icon-modal"
                >
                  {t("update")}
                </button>
              </>
            ) : (
              <>
                <div className="profile-info-text">{userData.nikname}</div>
                <button
                  onClick={() => {
                    setModalNikname(true);
                  }}
                  className="profile-info-icon"
                >
                  <img className="profile-icon" img src={edit} alt="Update"></img>
                </button>
              </>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-info-name">Open shop time:</div>
            <div className="profile-info-text">{userData.startWorkingTime || "Please, choose time"}</div>
            <button onClick={() => console.log("Edit")} className="profile-info-icon">
              <img className="profile-icon" img src={edit} alt="Update"></img>
            </button>
          </div>
          <div className="profile-info">
            <div className="profile-info-name">End of working day:</div>
            <div className="profile-info-text">{userData.endWorkingTime || "Please, choose time"}</div>
            <button onClick={() => console.log("Edit")} className="profile-info-icon">
              <img className="profile-icon" img src={edit} alt="Update"></img>
            </button>
          </div>
        </>
      )}
      {location && (
        <>
          <MapWindow initialLocation={location} onLocationSelect={handleLocationSelect} />

          <div>
            <h2>{t("registrationTextLocationMap")}</h2>
            <p>
              {t("registrationTextLocationMapLat")}
              {location.lat}
            </p>
            <p>
              {t("registrationTextLocationMapLon")}
              {location.lng}
            </p>
          </div>
        </>
      )}

      <button
        onClick={() => {
          updateLocation();
        }}
        className="profile-btn"
      >
        {t("update")}
      </button>
    </div>
  );
}

export default Profile;
