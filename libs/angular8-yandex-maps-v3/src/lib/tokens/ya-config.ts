import { InjectionToken } from '@angular/core';

import { YaConfig } from '../interfaces/ya-config';

/**
 * An injection token to provide a configuration.
 *
 * Use this token only if you want to implement some special logic.
 * Otherwise, use an `AngularYandexMapsModule.forRoot()` method in a root module.
 *
 * Please note that `YaApiLoaderService` is provided at the root level,
 * so it won't take your configuration unless this token is provided in the root module.
 *
 * If you want to provide the configuration in the module other than the root module, you have to provide `YaApiLoaderService`.
 * But keep in mind that starting from `v16.1.0` `YaApiLoaderService` supports the dynamic configuration,
 * if you provide this service it will lead to unexpected issues such as script duplications.
 *
 * ```ts
 * \@NgModule({
 *   imports: [AngularYandexMapsModule],
 *   providers: [
 *     YaApiLoaderService,
 *     {
 *       provide: YA_CONFIG,
 *       useValue: {
 *         apikey: null,
 *         lang: 'ru_RU',
 *       },
 *     },
 *   ],
 * })
 * export class HomeModule {}
 * ```
 */
export const YA_CONFIG = new InjectionToken<YaConfig>('YA_CONFIG', {
  factory: () => ({}),
});
