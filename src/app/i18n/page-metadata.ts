import { DOCUMENT, DestroyRef, LOCALE_ID, Service, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LOCALES, SITE_ORIGIN, absoluteLocaleUrl, toLocale } from './locales';

/**
 * Keeps each page's language metadata up to date: the title and meta description in the build's
 * language, the `hreflang` alternates that link the page in every locale plus the root as
 * `x-default`, and the canonical link to the page in the build's own locale. `<html lang>` is not
 * handled here: the localized build writes it.
 *
 * Call {@link PageMetadata.start} once at startup; it runs during prerendering too, so the
 * metadata is part of the static HTML.
 */
@Service()
export class PageMetadata {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly destroyRef = inject(DestroyRef);
  private readonly locale = toLocale(inject(LOCALE_ID));
  private started = false;

  /** Starts updating the metadata on every navigation. Further calls do nothing. */
  start(): void {
    if (this.started) return;
    this.started = true;
    const subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => this.update(event.urlAfterRedirects));
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private update(url: string): void {
    this.title.setTitle(
      $localize`:page title|Title of the site shown in the browser tab:modular-forge · Portfolio`,
    );
    this.meta.updateTag({
      name: 'description',
      content: $localize`:page description|Meta description of the site for search engines:Portfolio of modular-forge: the products and apps I have built for the web, Android and iOS, and how to get in touch.`,
    });
    this.setLinks(url);
  }

  /** Replaces the canonical and alternate links, so navigations never accumulate them. */
  private setLinks(url: string): void {
    const head = this.document.head;
    head
      .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
      .forEach((link) => link.remove());
    this.addLink({ rel: 'canonical', href: absoluteLocaleUrl(this.locale, url) });
    for (const locale of LOCALES) {
      this.addLink({ rel: 'alternate', hreflang: locale, href: absoluteLocaleUrl(locale, url) });
    }
    this.addLink({ rel: 'alternate', hreflang: 'x-default', href: `${SITE_ORIGIN}/` });
  }

  private addLink(attributes: Record<string, string>): void {
    const link = this.document.createElement('link');
    for (const [name, value] of Object.entries(attributes)) link.setAttribute(name, value);
    this.document.head.appendChild(link);
  }
}
