import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from './locales/en/translation0.json';
import hiTranslation from './locales/hi/translation0.json';
import mrTranslation from './locales/mr/translation0.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      mr: { translation: mrTranslation },
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;