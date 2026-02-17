import "server-only";

import { Locale, toLocale } from "./i18n";

const dictionaries = {
  en: () => import("@/locales/en.json").then((module) => module.default),
  "pt-br": () => import("@/locales/pt-br.json").then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)[Locale]>>;

export async function getDictionary(locale: string): Promise<Dictionary> {
  const normalizedLocale = toLocale(locale) ?? "en";
  const selectedDictionary = dictionaries[normalizedLocale];
  return selectedDictionary();
}

