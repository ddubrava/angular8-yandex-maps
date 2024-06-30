import { ModuleWithProviders, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

import { YaMapComponent } from './components/ya-map/ya-map.component';

import { YaConfig } from './interfaces/ya-config';
import { YA_CONFIG } from './tokens/ya-config';
import { YaMapDefaultSchemeLayerDirective } from './components/ya-map-default-scheme-layer/ya-map-default-scheme-layer.directive';
import { YaMapDefaultFeaturesLayerDirective } from './components/ya-map-default-features-layer/ya-map-default-features-layer.directive';
import { YaMapDefaultMarkerDirective } from './components/ya-map-default-marker/ya-map-default-marker.directive';

@NgModule({
  declarations: [
    // YaClustererComponent,
    // YaControlDirective,
    // YaGeoObjectDirective,
    YaMapComponent,
    YaMapDefaultSchemeLayerDirective,
    YaMapDefaultFeaturesLayerDirective,
    YaMapDefaultMarkerDirective,
    // YaMultirouteDirective,
    // YaObjectManagerDirective,
    // YaPanoramaDirective,
    // YaPlacemarkDirective,
  ],
  exports: [
    // YaClustererComponent,
    // YaControlDirective,
    // YaGeoObjectDirective,
    YaMapComponent,
    YaMapDefaultSchemeLayerDirective,
    YaMapDefaultFeaturesLayerDirective,
    YaMapDefaultMarkerDirective,
    // YaMultirouteDirective,
    // YaObjectManagerDirective,
    // YaPanoramaDirective,
    // YaPlacemarkDirective,
  ],
})
export class AngularYandexMapsModule {
  /**
   * Please use this method when registering the module at the root level.
   * If used in a lazy-loaded module, YaApiLoaderService will not take the provided configuration.
   * @param config configuration for YaApiLoaderService
   */
  static forRoot(
    config: YaConfig | Observable<YaConfig>,
  ): ModuleWithProviders<AngularYandexMapsModule> {
    return {
      ngModule: AngularYandexMapsModule,
      providers: [{ provide: YA_CONFIG, useValue: config }],
    };
  }
}
