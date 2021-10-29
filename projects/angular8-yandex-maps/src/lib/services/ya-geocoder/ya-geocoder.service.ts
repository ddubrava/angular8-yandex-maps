import { Injectable, NgZone } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { YaApiLoaderService } from '../ya-api-loader/ya-api-loader.service';

/**
 * The `YaGeocoder` service wraps `ymaps.geocode` static function from the Yandex.Maps API.
 *
 * @example
 * ```ts
 * import { YaGeocoderService } from 'angular8-yandex-maps';
 *
 * export class AppComponent {
 *   constructor(private yaGeocoderService: YaGeocoderService) {
 *     this.yaGeocoderService.geocode('Moscow')
 *       .subscribe(v => console.log(v))
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class YaGeocoderService {
  constructor(
    private readonly _ngZone: NgZone,
    private readonly _yaApiLoaderService: YaApiLoaderService,
  ) {}

  /**
   * Processes geocoding requests.
   * @param request The address for which coordinates need to be obtained (forward geocoding), or the coordinates for which the address needs to be determined (reverse geocoding).
   * @param options Options.
   */
  geocode(request: string | number[], options?: ymaps.IGeocodeOptions): Observable<object> {
    return this._yaApiLoaderService.load().pipe(
      switchMap(() => from(ymaps.geocode(request, options))),
      switchMap(
        (result) =>
          new Observable<object>((observer) => {
            this._ngZone.run(() => {
              observer.next(result);
              observer.complete();
            });
          }),
      ),
    );
  }
}