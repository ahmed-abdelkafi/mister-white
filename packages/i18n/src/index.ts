import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

export type Language = 'en' | 'fr' | 'ar';
export type TranslationKey = keyof typeof en;

export const translations: Record<Language, Record<string, string>> = {
  en,
  fr,
  ar,
};

export function t(lang: Language, key: TranslationKey, params?: Record<string, string | number>): string {
  const dict = translations[lang] || translations.en;
  let text = dict[key] || translations.en[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
    });
  }

  return text;
}

export function isRTL(lang: Language): boolean {
  return lang === 'ar';
}

export function getLanguageDirection(lang: Language): 'rtl' | 'ltr' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}
