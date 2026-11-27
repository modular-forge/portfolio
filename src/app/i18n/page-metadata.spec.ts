import { Component, DOCUMENT, LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { PageMetadata } from './page-metadata';

@Component({ template: '' })
class Blank {}

function alternates(document: Document): Record<string, string | null> {
  const links = document.head.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]');
  return Object.fromEntries(
    Array.from(links, (link) => [link.getAttribute('hreflang') ?? '', link.getAttribute('href')]),
  );
}

describe('PageMetadata', () => {
  let document: Document;
  let router: Router;

  function setup(localeId = 'en'): PageMetadata {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Blank },
          { path: 'projects/:slug', component: Blank },
        ]),
        { provide: LOCALE_ID, useValue: localeId },
      ],
    });
    document = TestBed.inject(DOCUMENT);
    document.title = '';
    router = TestBed.inject(Router);
    return TestBed.inject(PageMetadata);
  }

  afterEach(() => {
    document.title = '';
    document.head
      .querySelectorAll('link[rel="alternate"], link[rel="canonical"], meta[name="description"]')
      .forEach((element) => element.remove());
  });

  it('sets the page title and the meta description', async () => {
    setup().start();
    await router.navigateByUrl('/');

    expect(TestBed.inject(Title).getTitle()).toBe('modular-forge · Portfolio');
    const description = document.head.querySelector('meta[name="description"]');
    expect(description?.getAttribute('content')).toBe(
      'Portfolio of modular-forge: the products and apps I have built for the web, Android and iOS, and how to get in touch.',
    );
  });

  it('links the page in each language and the root as x-default', async () => {
    setup().start();
    await router.navigateByUrl('/projects/dianto?tab=a');

    expect(alternates(document)).toEqual({
      en: 'https://modular-forge.dev/en/projects/dianto',
      es: 'https://modular-forge.dev/es/projects/dianto',
      'x-default': 'https://modular-forge.dev/',
    });
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://modular-forge.dev/en/projects/dianto',
    );
  });

  it('replaces the alternates on each navigation instead of adding more', async () => {
    setup().start();
    await router.navigateByUrl('/projects/dianto');
    await router.navigateByUrl('/');

    expect(alternates(document)).toEqual({
      en: 'https://modular-forge.dev/en/',
      es: 'https://modular-forge.dev/es/',
      'x-default': 'https://modular-forge.dev/',
    });
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  });

  it('names the page in its own language as canonical', async () => {
    setup('es').start();
    await router.navigateByUrl('/projects/dianto?tab=a');
    await router.navigateByUrl('/projects/other');

    const canonical = document.head.querySelectorAll('link[rel="canonical"]');
    expect(canonical).toHaveLength(1);
    expect(canonical[0].getAttribute('href')).toBe('https://modular-forge.dev/es/projects/other');
  });

  it('listens to navigations only once when started twice', async () => {
    const metadata = setup();
    const setTitle = vi.spyOn(TestBed.inject(Title), 'setTitle');
    metadata.start();
    metadata.start();
    await router.navigateByUrl('/');

    expect(setTitle).toHaveBeenCalledTimes(1);
  });
});
