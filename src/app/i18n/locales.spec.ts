import {
  LOCALES,
  SITE_ORIGIN,
  absoluteLocaleUrl,
  localeName,
  localeUrl,
  otherLocale,
  toLocale,
} from './locales';

describe('locales', () => {
  it('supports English and Spanish, English first', () => {
    expect(LOCALES).toEqual(['en', 'es']);
  });

  it('names each locale in its own language', () => {
    expect(localeName('en')).toBe('English');
    expect(localeName('es')).toBe('Español');
  });

  describe('toLocale', () => {
    it('maps a supported locale id to itself', () => {
      expect(toLocale('en')).toBe('en');
      expect(toLocale('es')).toBe('es');
    });

    it('maps a regional id to its language', () => {
      expect(toLocale('es-ES')).toBe('es');
      expect(toLocale('en-US')).toBe('en');
    });

    it('ignores the case of the id', () => {
      expect(toLocale('ES')).toBe('es');
    });

    it('falls back to English for anything else', () => {
      expect(toLocale('fr')).toBe('en');
      expect(toLocale('')).toBe('en');
      expect(toLocale('es_ES')).toBe('en');
    });
  });

  it('gives the other locale of each one', () => {
    expect(otherLocale('en')).toBe('es');
    expect(otherLocale('es')).toBe('en');
  });

  describe('localeUrl', () => {
    it('prefixes the root path', () => {
      expect(localeUrl('en', '/')).toBe('/en/');
      expect(localeUrl('es', '/')).toBe('/es/');
    });

    it('treats an empty path as the root', () => {
      expect(localeUrl('es', '')).toBe('/es/');
    });

    it('prefixes nested paths', () => {
      expect(localeUrl('es', '/projects/dianto')).toBe('/es/projects/dianto');
      expect(localeUrl('en', '/projects/dianto')).toBe('/en/projects/dianto');
    });

    it('adds the leading slash when it is missing', () => {
      expect(localeUrl('es', 'projects')).toBe('/es/projects');
    });

    it('removes a trailing slash after a nested path', () => {
      expect(localeUrl('es', '/projects/')).toBe('/es/projects');
    });

    it('drops matrix parameters', () => {
      expect(localeUrl('es', '/projects;tab=a/dianto;view=b')).toBe('/es/projects/dianto');
    });

    it('keeps percent-encoded characters', () => {
      expect(localeUrl('en', '/projects/cash%20flow')).toBe('/en/projects/cash%20flow');
    });

    it('drops the query string and the fragment', () => {
      expect(localeUrl('es', '/projects?tag=angular#top')).toBe('/es/projects');
      expect(localeUrl('en', '/#contact')).toBe('/en/');
    });
  });

  describe('absoluteLocaleUrl', () => {
    it('joins the site origin and the locale URL', () => {
      expect(SITE_ORIGIN).toBe('https://modular-forge.dev');
      expect(absoluteLocaleUrl('es', '/projects/dianto')).toBe(
        'https://modular-forge.dev/es/projects/dianto',
      );
    });
  });
});
