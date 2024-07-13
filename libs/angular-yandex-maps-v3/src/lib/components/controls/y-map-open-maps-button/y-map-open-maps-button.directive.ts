import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { YMap, YMapControlButton } from '@yandex/ymaps3-types';
import { GenericEntity } from '@yandex/ymaps3-types/imperative/Entities';
import {
  YMapControl,
  YMapControlCommonButton,
  YMapControlCommonButtonProps,
  YMapControlProps,
} from '@yandex/ymaps3-types/imperative/YMapControl';
import {
  YMapOpenMapsButton,
  YMapOpenMapsButtonProps,
} from '@yandex/ymaps3-types/modules/controls-extra';
import {
  YMapGeolocationControlProps,
  YMapZoomControl,
  YMapZoomControlProps,
} from '@yandex/ymaps3-types/packages/controls';
import { from, Subject, takeUntil, tap } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { ComplexOptions } from '../../../types/complex-options';
import { YReadyEvent } from '../../../types/y-ready-event';
import { YMapControlsDirective } from '../y-map-controls/y-map-controls.directive';

/**
 * This component wraps the [ymaps3.YMapOpenMapsButton](https://yandex.ru/dev/jsapi30/doc/ru/ref/modules/controls-extra/#class-ymapopenmapsbutton) class from the Yandex.Maps API.
 * All component inputs are named the same as the API class constructor arguments. This component must be used inside a `y-map-controls` component.
 * This component is from the `@yandex/ymaps3-controls-extra` module, which is asynchronously loaded when you use this component.
 *
 * ```html
 * <y-map
 *   [props]="{
 *     location: {
 *       center: [-0.127696, 51.507351],
 *       zoom: 9,
 *     },
 *   }"
 * >
 *   <y-map-default-scheme-layer />
 *
 *   <y-map-controls [props]="{ position: 'top' }">
 *     <y-map-open-maps-button />
 *   </y-map-controls>
 * </y-map>
 * ```
 */
@Directive({
  selector: 'y-map-open-maps-button',
  standalone: true,
})
export class YMapOpenMapsButtonDirective implements OnInit, OnChanges, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private control?: YMapOpenMapsButton;

  /**
   * See the API entity documentation for detailed information. Supports ngOnChanges.
   * {@link https://yandex.ru/dev/jsapi30/doc/ru/ref/modules/controls-extra/#YMapOpenMapsButtonProps}
   */
  @Input() props: YMapOpenMapsButtonProps = {};

  /**
   * The entity instance is created. This event runs outside an Angular zone.
   */
  @Output() ready: EventEmitter<YReadyEvent<YMapOpenMapsButton>> = new EventEmitter<
    YReadyEvent<YMapOpenMapsButton>
  >();

  constructor(private readonly yMapControls: YMapControlsDirective) {}

  ngOnInit() {
    this.yMapControls.controls$
      .pipe(
        filter(Boolean),
        switchMap((controls) =>
          // It's safe to call it each time, the Yandex.Maps API handles multiple requests under the hood.
          from(ymaps3.import('@yandex/ymaps3-controls-extra')).pipe(
            tap(({ YMapOpenMapsButton }) => {
              this.control = new YMapOpenMapsButton(this.props);
              controls.addChild(this.control);
              this.ready.emit({ ymaps3, entity: this.control });
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.control) {
      this.control.update(changes['props'].currentValue);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
