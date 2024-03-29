import { ModuleWithProviders, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

import { YaClustererComponent } from './components/ya-clusterer/ya-clusterer.component';
import { YaControlDirective } from './components/ya-control/ya-control.directive';
import { YaGeoObjectDirective } from './components/ya-geoobject/ya-geoobject.directive';
import { YaMapComponent } from './components/ya-map/ya-map.component';
import { YaMultirouteDirective } from './components/ya-multiroute/ya-multiroute.directive';
import { YaObjectManagerDirective } from './components/ya-object-manager/ya-object-manager.directive';
import { YaPanoramaDirective } from './components/ya-panorama/ya-panorama.directive';
import { YaPlacemarkDirective } from './components/ya-placemark/ya-placemark.directive';
import { YaConfig } from './interfaces/ya-config';
import { YA_CONFIG } from './tokens/ya-config';

@NgModule({
  declarations: [
    YaClustererComponent,
    YaControlDirective,
    YaGeoObjectDirective,
    YaMapComponent,
    YaMultirouteDirective,
    YaObjectManagerDirective,
    YaPanoramaDirective,
    YaPlacemarkDirective,
  ],
  exports: [
    YaClustererComponent,
    YaControlDirective,
    YaGeoObjectDirective,
    YaMapComponent,
    YaMultirouteDirective,
    YaObjectManagerDirective,
    YaPanoramaDirective,
    YaPlacemarkDirective,
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
