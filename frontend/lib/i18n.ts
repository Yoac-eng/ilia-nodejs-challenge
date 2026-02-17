import { match } from "@formatjs/intl-localematcher";

export const locales = ["en", "pt-br"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function toLocale(value: string): Locale | null {
  const normalized = value.toLowerCase();
  return locales.find((locale) => locale === normalized) ?? null;
}

export function hasLocale(value: string): boolean {
  return toLocale(value) !== null;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment ? toLocale(segment) : null;
}

export function localizePath(pathname: string, locale: Locale): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const pathWithoutLocale = stripLocaleFromPathname(normalizedPath);
  return pathWithoutLocale === "/" ? `/${locale}` : `/${locale}${pathWithoutLocale}`;
}

export function stripLocaleFromPathname(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const locale = getLocaleFromPathname(normalizedPath);

  if (!locale) {
    return normalizedPath;
  }

  const withoutLocale = normalizedPath.slice(`/${locale}`.length);
  return withoutLocale.length > 0 ? withoutLocale : "/";
}

export function detectLocaleFromHeaders(headers: Headers): Locale {
  const acceptLanguage = headers.get("accept-language") ?? "";
  const languages = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter((value): value is string => Boolean(value));

  return match(languages, locales, defaultLocale) as Locale;
}

