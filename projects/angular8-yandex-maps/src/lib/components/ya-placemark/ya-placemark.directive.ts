import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { YaMapComponent } from '../ya-map/ya-map.component';
import { EventManager } from '../../event-manager';
import { YaReadyEvent } from '../../typings/ya-ready-event';
import { YaEvent } from '../../typings/ya-event';

/**
 * The `ya-placemark` directive wraps `ymaps.Placemark` class from the Yandex Maps API.
 * You can configure it via the directive's inputs.
 * Events can be bound using the outputs of the directive.
 *
 * <example-url>https://stackblitz.com/edit/custom-placemark?embed=1</example-url>
 *
 * @example
 * <ya-map [center]="[55.751952, 37.600739]">
 *              <ya-placemark [geometry]="[55.751952, 37.600739]"></ya-placemark>
 * </ya-map>
 */
@Directive({
  selector: 'ya-placemark',
})
export class YaPlacemarkDirective implements OnInit, OnChanges, OnDestroy {
  private readonly _sub = new Subscription();

  private readonly _eventManager = new EventManager(this._ngZone);

  placemark?: ymaps.Placemark;

  /**
   * Coordinates of the placemark, or a hash describing the geometry, or a reference to the point geometry object.
   * {@link https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Placemark.html#Placemark__param-geometry}
   */
  @Input() geometry: number[] | object | ymaps.IPointGeometry;

  /**
   * Properties for the placemark.
   * {@link https://yandex.com/maps/jsapi/doc/2.1/ref/reference/Placemark-docpage/#Placemarkparam-properties}
   */
  @Input() properties: ymaps.IPlacemarkProperties | ymaps.IDataManager;

  /**
   * Options for the placemark.
   * {@link https://yandex.com/maps/jsapi/doc/2.1/ref/reference/Placemark-docpage/#Placemarkparam-options}
   */
  @Input() options: ymaps.IPlacemarkOptions;

  /**
   * Placemark instance is added in a Map.
   */
  @Output() ready: EventEmitter<YaReadyEvent<ymaps.Placemark>> = new EventEmitter<
    YaReadyEvent<ymaps.Placemark>
  >();

  /**
   * Closing the balloon.
   */
  @Output() balloonclose: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('balloonclose');

  /**
   * Opening a balloon on a map.
   */
  @Output() balloonopen: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('balloonopen');

  /**
   * Event preceding the "drag" event.
   */
  @Output() beforedrag: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('beforedrag');

  /**
   * Event preceding the "dragstart" event.
   */
  @Output() beforedragstart: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('beforedragstart');

  /**
   * Single left-click on the object.
   */
  @Output() yaclick: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('click');

  /**
   * Calls the element's context menu.
   */
  @Output() yacontextmenu: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('contextmenu');

  /**
   * Double left-click on the object.
   */
  @Output() yadbclick: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('dbclick');

  /**
   * Dragging a geo object.
   */
  @Output() yadrag: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('drag');

  /**
   * End of geo object dragging.
   */
  @Output() yadragend: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('dragend');

  /**
   * Start of geo object dragging.
   */
  @Output() yadragstart: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('dragstart');

  /**
   * Change in the state of the editor for the geo object's geometry.
   */
  @Output() editorstatechange: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('editorstatechange');

  /**
   * Change to the geo object geometry
   */
  @Output() geometrychange: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('geometrychange');

  /**
   * Closing the hint.
   */
  @Output() hintclose: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('hintclose');

  /**
   * Opening a hint on a map.
   */
  @Output() hintopen: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('hintopen');

  /**
   * Map reference changed.
   */
  @Output() mapchange: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('mapchange');

  /**
   * Pressing the mouse button over the object.
   */
  @Output() yamousedown: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('mousedown');

  /**
   * Pointing the cursor at the object.
   */
  @Output() yamouseenter: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('mouseenter');

  /**
   * Moving the cursor off of the object.
   */
  @Output() yamouseleave: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('mouseleave');

  /**
   * Moving the cursor over the object.
   */
  @Output() yamousemove: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('mousemove');

  /**
   * Letting go of the mouse button over an object.
   */
  @Output() yamouseup: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('mouseup');

  /**
   * End of multitouch.
   */
  @Output() multitouchend: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('multitouchend');

  /**
   * Repeating event during multitouch.
   */
  @Output() multitouchmove: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('multitouchmove');

  /**
   * Start of multitouch.
   */
  @Output() multitouchstart: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('multitouchstart');

  /**
   * Change to the object options.
   */
  @Output() optionschange: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('optionschange');

  /**
   * Change to the geo object overlay.
   */
  @Output() overlaychange: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('overlaychange');

  /**
   * The parent object reference changed.
   */
  @Output() parentchange: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('parentchange');

  /**
   * Change to the geo object data.
   */
  @Output() propertieschange: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('propertieschange');

  /**
   * Mouse wheel scrolling.
   */
  @Output() yawheel: Observable<YaEvent<ymaps.Placemark>> =
    this._eventManager.getLazyEmitter('wheel');

  constructor(private readonly _ngZone: NgZone, private readonly _yaMapComponent: YaMapComponent) {}

  /**
   * Handles input changes and passes them in API.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    const { placemark } = this;

    if (placemark) {
      const { geometry, properties, options } = changes;

      if (geometry) {
        placemark.geometry?.setCoordinates(geometry.currentValue);
      }

      if (properties) {
        placemark.properties.set(properties.currentValue);
      }

      if (options) {
        placemark.options.set(options.currentValue);
      }
    }
  }

  ngOnInit(): void {
    if (this._yaMapComponent.isBrowser) {
      const sub = this._yaMapComponent.map$.subscribe((map) => {
        if (map) {
          const placemark = this._createPlacemark();
          this.placemark = placemark;

          map.geoObjects.add(placemark);
          this._eventManager.setTarget(placemark);
          this._ngZone.run(() => this.ready.emit({ ymaps, target: placemark }));
        }
      });

      this._sub.add(sub);
    }
  }

  ngOnDestroy(): void {
    if (this.placemark) {
      this._yaMapComponent?.map$.value?.geoObjects.remove(this.placemark);
      this._eventManager.destroy();
    }

    this._sub.unsubscribe();
  }

  /**
   * Creates a placemark.
   */
  private _createPlacemark(): ymaps.Placemark {
    return new ymaps.Placemark(this.geometry, this.properties, this.options);
  }
}
