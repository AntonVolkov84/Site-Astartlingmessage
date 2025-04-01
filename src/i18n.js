import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

export const LanguageResources = {
  en: { translation: en },
  ru: { translation: ru },
};
i18n.use(initReactI18next).init({
  fallbackLng: "en",
  compatibilityJSON: "v3",
  lng: "en",
  resources: LanguageResources,
});

export default i18n;
