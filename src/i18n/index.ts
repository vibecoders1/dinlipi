import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import bn from './locales/bn.json';
import en from './locales/en.json';
import as from './locales/as.json';
import hi from './locales/hi.json';
import ru from './locales/ru.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const resources = {
  bn: { translation: bn },
  en: { translation: en },
  as: { translation: as },
  hi: { translation: hi },
  ru: { translation: ru },
  fr: { translation: fr },
  ar: { translation: ar }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;