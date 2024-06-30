import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps-v3';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../environments/environment.local';
import { AppComponent } from './app.component';

export const mapConfig$ = new BehaviorSubject<YaConfig>({
  apikey: environment.apikey,
});

@NgModule({
  declarations: [AppComponent],
  imports: [AngularYandexMapsModule.forRoot(mapConfig$), BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
