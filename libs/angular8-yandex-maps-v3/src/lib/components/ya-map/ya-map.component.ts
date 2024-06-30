import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  YMap,
  YMapCenterLocation,
  YMapEntity,
  YMapProps,
  YMapZoomLocation,
} from '@yandex/ymaps3-types';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { YaEvent } from '../../interfaces/ya-event';
import { YaReadyEvent } from '../../interfaces/ya-ready-event';
import { YaApiLoaderService } from '../../services/ya-api-loader/ya-api-loader.service';
import { EventManager } from '../../utils/event-manager/event-manager';
import { generateRandomId } from '../../utils/generate-random-id/generate-random-id';

/**
 * The `ya-map` component wraps `ymaps.Map` class from the Yandex.Maps API.
 * You can configure the map via the component's inputs.
 * Events can be bound using the outputs of the component.
 *
 * <example-url>https://stackblitz.com/edit/map-onload-event?embed=1&view=preview</example-url>
 *
 * @example
 * ```html
 * <ya-map
 *   [center]="[55.751952, 37.600739]"
 *   [state]="{type: 'yandex#satellite'}"
 * ></ya-map>
 * ```
 */
@Component({
  selector: 'ya-map',
  template: '<div #container></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YaMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('container') readonly container!: ElementRef;

  private readonly destroy$ = new Subject<void>();

  private readonly eventManager = new EventManager(this.ngZone);

  map$ = new BehaviorSubject<YMap | null>(null);

  /**
   * Geo coordinates of the map center. Default is `[0, 0]`.
   * Shorthand for `[state]="{ center: [0, 0] }"`.
   * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#Map__param-state.center}
   */
  @Input({ required: true }) center: YMapCenterLocation['center'] = [0, 0];

  /**
   * Map zoom level. Default level is `10`.
   * Shorthand for `[state]="{ zoom: 10 }"`.
   * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#Map__param-state.zoom}
   */
  @Input({ required: true }) zoom: YMapZoomLocation['zoom'] = 10;

  /**
   * Map parameters.
   * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#Map__param-state}
   */
  @Input() props?: YMapProps;

  @Input() children?: YMapEntity<unknown, object>[];

  /**
   * Map instance is created. This event runs outside an Angular zone.
   */
  @Output() ready: EventEmitter<YaReadyEvent<YMap>> = new EventEmitter<YaReadyEvent<YMap>>();

  /**
   * The start of a new smooth map movement.
   * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actionbegin}
   */
  @Output() yaClick: Observable<YaEvent<YMap>> = this.eventManager.getLazyEmitter('onClick');

  //
  // /**
  //  * Event that occurs when an action step was prematurely stopped.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actionbreak}
  //  */
  // @Output() actionbreak: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('actionbreak');
  //
  // /**
  //  * The end of smooth map movement.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actionend}
  //  */
  // @Output() actionend: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('actionend');
  //
  // /**
  //  * The start of a new step of smooth movement.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actiontick}
  //  */
  // @Output() actiontick: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('actiontick');
  //
  // /**
  //  * The end of performing a step of smooth movement.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actiontickcomplete}
  //  */
  // @Output() actiontickcomplete: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('actiontickcomplete');
  //
  // /**
  //  * Closing the balloon.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-balloonclose}
  //  */
  // @Output() balloonclose: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('balloonclose');
  //
  // /**
  //  * Opening a balloon on a map.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-balloonopen}
  //  */
  // @Output() balloonopen: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('balloonopen');
  //
  // /**
  //  * Event for a change to the map viewport.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-boundschange}
  //  */
  // @Output() boundschange: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('boundschange');
  //
  // /**
  //  * Single left-click on the object.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-click}
  //  */
  // @Output() yaclick: Observable<YaEvent<YMap>> = this.eventManager.getLazyEmitter('click');
  //
  // /**
  //  * Calls the element's context menu.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-contextmenu}
  //  */
  // @Output() yacontextmenu: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('contextmenu');
  //
  // /**
  //  * Double left-click on the object.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-dblclick}
  //  */
  // @Output() yadblclick: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('dblclick');
  //
  // /**
  //  * The map was destroyed.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-destroy}
  //  */
  // @Output() destroy: Observable<YaEvent<YMap>> = this.eventManager.getLazyEmitter('destroy');
  //
  // /**
  //  * Closing the hint.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-hintclose}
  //  */
  // @Output() hintclose: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('hintclose');
  //
  // /**
  //  * Opening a hint on a map.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-hintopen}
  //  */
  // @Output() hintopen: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('hintopen');
  //
  // /**
  //  * Map margins changed.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-marginchange}
  //  */
  // @Output() marginchange: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('marginchange');
  //
  // /**
  //  * Pressing the mouse button over the object.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mousedown}
  //  */
  // @Output() yamousedown: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('mousedown');
  //
  // /**
  //  * Pointing the cursor at the object.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mouseenter}
  //  */
  // @Output() yamouseenter: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('mouseenter');
  //
  // /**
  //  * Moving the cursor off of the object.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mouseleave}
  //  */
  // @Output() yamouseleave: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('mouseleave');
  //
  // /**
  //  * Moving the cursor over the object.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mousemove}
  //  */
  // @Output() yamousemove: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('mousemove');
  //
  // /**
  //  * Letting go of the mouse button over an object.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mouseup}
  //  */
  // @Output() yamouseup: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('mouseup');
  //
  // /**
  //  * End of multitouch.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-multitouchend}
  //  */
  // @Output() multitouchend: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('multitouchend');
  //
  // /**
  //  * Repeating event during multitouch.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-multitouchmove}
  //  */
  // @Output() multitouchmove: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('multitouchmove');
  //
  // /**
  //  * Start of multitouch.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-multitouchstart}
  //  */
  // @Output() multitouchstart: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('multitouchstart');
  //
  // /**
  //  * Map options changed.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-optionschange}
  //  */
  // @Output() optionschange: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('optionschange');
  //
  // /**
  //  * Map size changed.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-sizechange}
  //  */
  // @Output() sizechange: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('sizechange');
  //
  // /**
  //  * The map type changed.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-typechange}
  //  */
  // @Output() typechange: Observable<YaEvent<YMap>> =
  //   this.eventManager.getLazyEmitter('typechange');
  //
  // /**
  //  * Mouse wheel scrolling.
  //  * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-wheel}
  //  */
  // @Output() yawheel: Observable<YaEvent<YMap>> = this.eventManager.getLazyEmitter('wheel');

  constructor(
    private readonly ngZone: NgZone,
    private readonly yaApiLoaderService: YaApiLoaderService,
  ) {}

  /**
   * Handles input changes and passes them in API.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    const map = this.map$.value;

    if (map) {
      const { center, zoom, props } = changes;

      if (center) {
        map.setLocation({ center: center.currentValue });
      }

      if (zoom) {
        map.setLocation({ zoom: zoom.currentValue });
      }

      if (props) {
        this.setProps(props.currentValue, map);
      }
    }
  }

  ngAfterViewInit(): void {
    this.yaApiLoaderService
      .load()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const id = generateRandomId();
        const map = this.createMap(id);

        /**
         * Once the configuration is changed, e.g. language,
         * we need to reinitialize the map.
         */
        if (this.map$.value) {
          this.map$.value.destroy();
        }

        this.map$.next(map);
        this.eventManager.setTarget(map);
        this.ready.emit({ ymaps3, target: map });
      });
  }

  ngOnDestroy(): void {
    this.eventManager.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Destructs state and passes it in API.
   * @param state
   * @param map
   */
  private setProps(props: YMapProps, map: YMap): void {
    const {
      mode,
      location,
      restrictMapArea,
      projection,
      zoomRange,
      behaviors,
      camera,
      config,
      margin,
      zoomRounding,
    } = props;

    // Check what options are not set.
    // E.g., check ...rest length.

    if (mode) {
      map.setMode(mode);
    }

    if (location) {
      map.setLocation(location);
    }

    if (restrictMapArea) {
      map.setRestrictMapArea(restrictMapArea);
    }

    if (projection) {
      map.setProjection(projection);
    }

    if (zoomRange) {
      map.setZoomRange(zoomRange);
    }

    if (behaviors) {
      map.setBehaviors(behaviors);
    }

    if (camera) {
      map.setCamera(camera);
    }

    if (config) {
      map.setConfig(config);
    }

    if (margin) {
      map.setMargin(margin);
    }

    if (zoomRounding) {
      map.setZoomRounding(zoomRounding);
    }
  }

  /**
   * Creates a map.
   * @param id ID which will be set to the map container.
   */
  private createMap(id: string): YMap {
    const containerElem: HTMLElement = this.container.nativeElement;

    containerElem.setAttribute('id', id);
    containerElem.style.cssText = 'width: 100%; height: 100%;';

    return new ymaps3.YMap(containerElem, this.combineProps(), this.children);
  }

  /**
   * Combines the center and zoom into single object.
   */
  private combineProps(): YMapProps {
    return {
      ...this.props,
      location: {
        ...this.props?.location,
        center: this.center,
        zoom: this.zoom,
      },
    };
  }
}
