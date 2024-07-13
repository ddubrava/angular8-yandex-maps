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
import {
  YMap,
  YMapControls,
  YMapControlsProps,
  YMapEntity,
  YMapFeature,
  YMapFeatureProps,
} from '@yandex/ymaps3-types';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';

import { YReadyEvent } from '../../../types/y-ready-event';
import { YMapComponent } from '../../common/y-map/y-map.component';

/**
 * This component wraps the [ymaps3.YMapControls](https://yandex.ru/dev/jsapi30/doc/ru/ref/#class-ymapcontrols) class from the Yandex.Maps API.
 * All component inputs are named the same as the API class constructor arguments.
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
 *     ...
 *   </y-map-controls>
 * </y-map>
 * ```
 */
@Directive({
  selector: 'y-map-controls',
  standalone: true,
})
export class YMapControlsDirective implements OnInit, OnChanges, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  controls$ = new BehaviorSubject<YMapControls | null>(null);

  /**
   * Controls properties. Supports ngOnChanges.
   * {@link https://yandex.ru/dev/jsapi30/doc/ru/ref/#YMapControlsProps}
   */
  @Input({ required: true }) props!: YMapControlsProps;

  /**
   * See the API entity documentation for detailed information.
   */
  @Input() children?: YMapEntity<unknown, object>[];

  /**
   * The entity instance is created. This event runs outside an Angular zone.
   */
  @Output() ready: EventEmitter<YReadyEvent<YMapControls>> = new EventEmitter<
    YReadyEvent<YMapControls>
  >();

  constructor(private readonly yMapComponent: YMapComponent) {}

  ngOnInit() {
    this.yMapComponent.map$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((map) => {
      const controls = new ymaps3.YMapControls(this.props, this.children);

      map.addChild(controls);
      this.controls$.next(controls);
      this.ready.emit({ ymaps3, entity: controls });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.controls$.value) {
      this.controls$.value.update(changes['props'].currentValue);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
