import { Locale } from '@/i18n';
import ar from '@/messages/ar.json';
import en from '@/messages/en.json';

export const translations = {
  ar,
  en,
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

