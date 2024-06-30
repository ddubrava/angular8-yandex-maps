import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { YMapDefaultMarkerProps } from '@yandex/ymaps3-types/packages/markers';
import { from, Subject, takeUntil, tap } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { YaMapComponent } from '../ya-map/ya-map.component';

@Directive({
  selector: 'ya-map-default-marker',
  // standalone: true,
})
export class YaMapDefaultMarkerDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @Input({ required: true }) props?: YMapDefaultMarkerProps;

  constructor(private readonly yaMapComponent: YaMapComponent) {}

  ngOnInit(): void {
    this.yaMapComponent.map$
      .pipe(
        filter(Boolean),
        switchMap((map) =>
          // It's safe to call it each time, Yandex.Maps handles multiple requests under the hood.
          from(ymaps3.import('@yandex/ymaps3-markers@0.0.1')).pipe(
            tap(({ YMapDefaultMarker }) => {
              if (this.props) {
                map.addChild(new YMapDefaultMarker(this.props));
              }
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
