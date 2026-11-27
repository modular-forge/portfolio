import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from './i18n/language-switcher/language-switcher';

@Component({
  imports: [RouterOutlet, LanguageSwitcher],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('portfolio');
}
