import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import deTranslation from './locales/de.json';
import enTranslation from './locales/en.json';

const savedLang = localStorage.getItem('bc_language') || 'de';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: deTranslation },
      en: { translation: enTranslation },
    },
    lng: savedLang,
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
