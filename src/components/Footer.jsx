import React from "react";
import "./footer.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <>
      <div className="footer">
        <p>{t("footer")}</p>
        <p>{t("INN")}</p>
        <p>{t("adress")}</p>
        <p>{t("email")}</p>
        <p>{t("phone")}</p>
      </div>
    </>
  );
}

export default Footer;
