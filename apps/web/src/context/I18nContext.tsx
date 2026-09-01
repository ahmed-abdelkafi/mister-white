import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, TranslationKey, t, isRTL, getLanguageDirection } from '@mister-white/i18n';

interface I18nContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('mw_lang') as Language;
    if (saved && ['en', 'fr', 'ar'].includes(saved)) return saved;
    const navLang = navigator.language.slice(0, 2);
    if (navLang === 'fr') return 'fr';
    if (navLang === 'ar') return 'ar';
    return 'en';
  });

  const setLanguage = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('mw_lang', newLang);
  }, []);

  useEffect(() => {
    const dir = getLanguageDirection(lang);
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const translate = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      return t(lang, key, params);
    },
    [lang]
  );

  const value = {
    lang,
    setLanguage,
    t: translate,
    isRTL: isRTL(lang),
    dir: getLanguageDirection(lang),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
