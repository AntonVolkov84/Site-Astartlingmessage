import React from "react";
import "./footer.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <>
      <div className="footer">
        {t("footer")} {t("INN")} {t("adress")} {t("email")} {t("phone")}
      </div>
    </>
  );
}

export default Footer;
