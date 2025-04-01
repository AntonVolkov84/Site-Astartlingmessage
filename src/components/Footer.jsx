import React from "react";
import "./footer.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return <div className="footer">{t("footer")}</div>;
}

export default Footer;
