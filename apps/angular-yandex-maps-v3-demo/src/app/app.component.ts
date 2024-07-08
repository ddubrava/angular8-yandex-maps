import { ChangeDetectionStrategy, Component, DoCheck } from '@angular/core';
import {
  YConfig,
  YMapComponent,
  YMapDefaultFeaturesLayerDirective,
  YMapDefaultMarkerDirective,
  YMapDefaultSchemeLayerDirective,
  YMapFeatureDirective,
  YMapListenerDirective,
  YMapMarkerDirective,
} from 'angular-yandex-maps-v3';

import { environment } from '../environments/environment';
import { config$ } from './app.config';

@Component({
  standalone: true,
  imports: [
    YMapComponent,
    YMapDefaultFeaturesLayerDirective,
    YMapDefaultMarkerDirective,
    YMapDefaultSchemeLayerDirective,
    YMapFeatureDirective,
    YMapMarkerDirective,
    YMapListenerDirective,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // Do not enable OnPush, otherwise, we can't catch performance issues.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements DoCheck {
  lang: YConfig['lang'] = 'ru_RU';

  ngDoCheck() {
    console.log('do check');
  }

  onMarkerClick(event: unknown) {
    console.log(event);
  }

  onListenerClick(event: unknown) {
    console.log(event);
  }

  toggleLanguage() {
    this.lang = this.lang === 'ru_RU' ? 'en_US' : 'ru_RU';
    config$.next({ lang: this.lang, apikey: environment.apikey });
  }
}