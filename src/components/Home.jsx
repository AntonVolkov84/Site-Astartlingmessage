import React from "react";
import "./home.css";
import { useTranslation } from "react-i18next";
import mainscreen from "../images/mainscreen.jpg";
import profile from "../images/profile.jpg";
import addcompanion from "../images/addcompanion.jpg";
import message from "../images/message.jpg";

function Home() {
  const { t } = useTranslation();
  return (
    <div className="home">
      <p className="home-text">{t("homeInfo")}</p>
      <div className="home-block-instruction">
        <img src={mainscreen} alt="main screen of mobile app" className="home-block-img"></img>
        <div className="home-block-info">
          <p className="home-block-text">{t("homeFirstInfo1title")}</p>
          <p className="home-block-text">{t("homeFirstInfoFirst1")}</p>
          <p className="home-block-text">{t("homeFirstInfoFirst2")}</p>
          <p className="home-block-text">{t("homeFirstInfoFirst3")}</p>
          <p className="home-block-text">{t("homeFirstInfoFirst4")}</p>
        </div>
      </div>
      <div className="home-block-instruction">
        <div className="home-block-info">
          <p className="home-block-text">{t("homeFirstInfo2title")}</p>
          <p className="home-block-text">{t("homeFirstInfoSecond1")}</p>
          <p className="home-block-text">{t("homeFirstInfoSecond2")}</p>
          <p className="home-block-text">{t("homeFirstInfoSecond3")}</p>
          <p className="home-block-text">{t("homeFirstInfoSecond4")}</p>
          <p className="home-block-text">{t("homeFirstInfoSecond5")}</p>
        </div>
        <img src={profile} alt="main screen of mobile app" className="home-block-img"></img>
      </div>
      <div className="home-block-instruction">
        <img src={addcompanion} alt="main screen of mobile app" className="home-block-img"></img>
        <div className="home-block-info">
          <p className="home-block-text">{t("homeFirstInfo3title")}</p>
          <p className="home-block-text">{t("homeFirstInfoThird1")}</p>
        </div>
      </div>
      <div className="home-block-instruction">
        <div className="home-block-info">
          <p className="home-block-text">{t("homeFirstInfo4title")}</p>
          <p className="home-block-text">{t("homeFirstInfoFourth1")}</p>
          <p className="home-block-text">{t("homeFirstInfoFourth2")}</p>
          <p className="home-block-text">{t("homeFirstInfoFourth3")}</p>
          <p className="home-block-text">{t("homeFirstInfoFourth4")}</p>
          <p className="home-block-text">{t("homeFirstInfoFourth5")}</p>
        </div>
        <img src={message} alt="main screen of mobile app" className="home-block-img"></img>
      </div>
      <p className="home-text">{t("homeInfoFinal")}</p>
    </div>
  );
}

export default Home;
