import { Component, LOCALE_ID } from '@angular/core';
import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { LanguageSwitcher } from './language-switcher';

@Component({ template: '<app-language-switcher />', imports: [LanguageSwitcher] })
class Page {}

async function createHarness(localeId: string): Promise<RouterTestingHarness> {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: '', component: Page },
        { path: 'projects/:slug', component: Page },
      ]),
      { provide: LOCALE_ID, useValue: localeId },
    ],
  });
  return RouterTestingHarness.create();
}

async function visit(harness: RouterTestingHarness, url: string): Promise<HTMLElement> {
  await harness.navigateByUrl(url);
  await harness.fixture.whenStable();
  return harness.fixture.nativeElement as HTMLElement;
}

async function render(localeId: string, url: string): Promise<HTMLElement> {
  return visit(await createHarness(localeId), url);
}

describe('LanguageSwitcher', () => {
  it('links an English page to the same page in Spanish', async () => {
    const page = await render('en', '/projects/dianto');
    const link = page.querySelector('a');

    expect(link?.getAttribute('href')).toBe('/es/projects/dianto');
    expect(link?.getAttribute('hreflang')).toBe('es');
    expect(link?.getAttribute('lang')).toBe('es');
    expect(link?.textContent.trim()).toBe('Español');
  });

  it('links a Spanish page to the same page in English', async () => {
    const page = await render('es', '/');
    const link = page.querySelector('a');

    expect(link?.getAttribute('href')).toBe('/en/');
    expect(link?.getAttribute('hreflang')).toBe('en');
    expect(link?.getAttribute('lang')).toBe('en');
    expect(link?.textContent.trim()).toBe('English');
  });

  it('places the link in a named navigation region', async () => {
    const page = await render('en', '/');
    const nav = page.querySelector('nav');

    expect(nav?.getAttribute('aria-label')).toBe('Language');
    expect(nav?.querySelector('a')).not.toBeNull();
  });

  it('starts from the browser location before the first navigation ends', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
    TestBed.inject(Location).go('/projects/dianto');
    const fixture = TestBed.createComponent(LanguageSwitcher);
    await fixture.whenStable();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('href')).toBe('/es/projects/dianto');
  });

  it('follows navigations to other pages', async () => {
    const harness = await createHarness('en');
    await visit(harness, '/');
    const page = await visit(harness, '/projects/other');

    const link = page.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/es/projects/other');
  });
});
