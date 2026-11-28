import { Location } from '@angular/common';
import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { localeName, localeUrl, otherLocale, toLocale } from '../locales';

/**
 * Link to the current page in the other language. A plain `href`, not `routerLink`: the other
 * language is a separate build, so the browser must load it. Nothing is stored about the choice.
 */
@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  // Starts from the browser location, not router.url: in the browser the first navigation ends
  // after hydration, and router.url is still "/" until then, which would link a deep page to the
  // other language's home for a moment.
  private readonly url = toSignal(
    inject(Router).events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: inject(Location).path() },
  );

  protected readonly target = otherLocale(toLocale(inject(LOCALE_ID)));
  protected readonly targetName = localeName(this.target);
  protected readonly href = computed(() => localeUrl(this.target, this.url()));
}
