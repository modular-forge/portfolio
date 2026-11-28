/** Locales the site is built in; the first one is the default and the source language. */
export const LOCALES = ['en', 'es'] as const;

/** A locale the site is built in. */
export type Locale = (typeof LOCALES)[number];

/** Public origin of the site, used for absolute URLs such as `hreflang` alternates. */
export const SITE_ORIGIN = 'https://modular-forge.dev';

/** Each locale's name written in that locale, as shown in the language switcher. */
const NAMES: Record<Locale, string> = { en: 'English', es: 'Español' };

/** Returns the locale's name in its own language ("English", "Español"). */
export function localeName(locale: Locale): string {
  return NAMES[locale];
}

/**
 * Maps a locale id, such as Angular's `LOCALE_ID`, to a supported locale by its language
 * (`es-ES` → `es`). Anything unsupported falls back to the default locale.
 */
export function toLocale(id: string): Locale {
  const language = id.split('-')[0].toLowerCase();
  return LOCALES.find((locale) => locale === language) ?? LOCALES[0];
}

/** The locale the switcher offers from each locale; a new locale must be added here too. */
const OTHER: Record<Locale, Locale> = { en: 'es', es: 'en' };

/** Returns the locale the language switcher links to from `locale`. */
export function otherLocale(locale: Locale): Locale {
  return OTHER[locale];
}

/**
 * Builds the site-relative URL of a page in a locale: `localeUrl('es', '/projects')` →
 * `/es/projects`. `path` is a router URL without the base href. Its query string, fragment and
 * matrix parameters are dropped and a trailing slash after a nested path is removed, because the
 * URL identifies the page, not its state. Percent-encoded characters are kept as they are.
 */
export function localeUrl(locale: Locale, path: string): string {
  const pathname = path.split(/[?#]/)[0].replace(/;[^/]*/g, '');
  const segments = pathname.split('/').filter((segment) => segment !== '');
  return `/${locale}/${segments.join('/')}`;
}

/** Same as {@link localeUrl}, with the site's public origin in front. */
export function absoluteLocaleUrl(locale: Locale, path: string): string {
  return `${SITE_ORIGIN}${localeUrl(locale, path)}`;
}
