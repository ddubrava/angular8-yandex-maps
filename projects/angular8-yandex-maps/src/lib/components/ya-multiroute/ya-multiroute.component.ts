import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { generateRandomId } from '../../utils/generateRandomId';
import { IEvent, ILoadEvent } from '../../models/models';

/**
 * Component for creating Multi-route on the map
 *
 * @example `<ya-multiroute [referencePoints]="[[55.751952, 37.600739], 'Красные ворота, Москва']"></ya-multiroute>`.
 * @see {@link https://ddubrava.github.io/angular8-yandex-maps/#/components/multiroute}
 */
@Component({
  selector: 'ya-multiroute',
  templateUrl: './ya-multiroute.component.html',
  styleUrls: ['./ya-multiroute.component.scss'],
})
export class YaMultirouteComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Reference points for the multi-route.
   * @see {@link https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/IMultiRouteReferencePoint-docpage/}
   */
  @Input() public referencePoints: ymaps.IMultiRouteReferencePoint[];
  /**
   * Model description object of a multiroute.
   */
  @Input() public model: ymaps.IMultiRouteModelJson;
  /**
   * Options for the multiroute.
   * @see
   * {@link https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/multiRouter.MultiRoute-docpage/#multiRouter.MultiRouteparam-options}
   */
  @Input() public options: any;

  /**
   * Emits immediately after this entity is added in root container.
   */
  @Output() public load = new EventEmitter<ILoadEvent>();
  /**
   * Change to the active route.
   */
  @Output() public activeroutechange = new EventEmitter<IEvent>();
  /**
   * Actions with the balloon.
   */
  @Output() public balloon = new EventEmitter<IEvent>();
  /**
   * Left-click on the object.
   */
  @Output() public yaclick = new EventEmitter<IEvent>();
  /**
   * Mouse actions with the object.
   */
  @Output() public mouse = new EventEmitter<IEvent>();
  /**
   * Multitouch actions with the object.
   */
  @Output() public multitouch = new EventEmitter<IEvent>();

  public id: string;

  // Yandex.Maps API.
  private map: ymaps.Map;
  private multiroute: ymaps.multiRouter.MultiRoute;

  constructor(private ngZone: NgZone) {}

  public ngOnInit(): void {
    this.logErrors();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.updateMultiroute(changes);
  }

  /**
   * Method for dynamic Miltiroute configuration.
   * Handles input changes and provides it to API.
   * @param changes
   */
  private updateMultiroute(changes: SimpleChanges): void {
    const { multiroute } = this;

    if (!multiroute) return;

    const { referencePoints, model, options } = changes;

    if (referencePoints) {
      multiroute.model.setReferencePoints(referencePoints.currentValue);
    }

    if (model) {
      this.setModel(model.currentValue, multiroute);
    }

    if (options) {
      /**
       * Wrong typings in DefinitelyTyped.
       */
      (multiroute.options as any).set(options.currentValue);
    }
  }

  /**
   * Destructs state and provides new values to API.
   * @param model
   * @param multiroute
   */
  private setModel(
    model: ymaps.IMultiRouteModelJson,
    multiroute: ymaps.multiRouter.MultiRoute,
  ): void {
    const { referencePoints, params } = model;

    if (referencePoints) {
      multiroute.model.setReferencePoints(referencePoints);
    }

    if (params) {
      multiroute.model.setParams(params);
    }
  }

  private logErrors(): void {
    if (!this.referencePoints) {
      console.error('Multiroute: referencePoints input is required.');
      this.referencePoints = [];
    }
  }

  /**
   * Creates Multiroute.
   *
   * @param map Necessary for removing entity from map.geoObjects on Multiroute destroy
   * `this.map.geoObjects.remove(this.multiroute);`.
   */
  public createMultiroute(map: ymaps.Map): ymaps.multiRouter.MultiRoute {
    const multiroute = new ymaps.multiRouter.MultiRoute(
      { ...this.model, referencePoints: this.referencePoints },
      this.options,
    );

    this.id = generateRandomId();
    this.map = map;
    this.multiroute = multiroute;

    this.addEventListeners();

    return multiroute;
  }

  /**
   * Adds listeners on the Multiroute events.
   */
  private addEventListeners(): void {
    const { multiroute } = this;

    this.ngZone.run(() => this.load.emit({ ymaps, instance: multiroute }));

    const handlers = [
      {
        name: 'activeroutechange',
        fn: (e: any) =>
          this.activeroutechange.emit({
            ymaps,
            instance: multiroute,
            type: e.originalEvent.type,
            event: e,
          }),
      },
      {
        name: ['balloonopen', 'balloonclose'],
        fn: (e: any) =>
          this.balloon.emit({ ymaps, instance: multiroute, type: e.originalEvent.type, event: e }),
      },
      {
        name: ['click', 'dblclick'],
        fn: (e: any) =>
          this.yaclick.emit({ ymaps, instance: multiroute, type: e.originalEvent.type, event: e }),
      },
      {
        name: ['mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseup'],
        fn: (e: any) =>
          this.mouse.emit({ ymaps, instance: multiroute, type: e.originalEvent.type, event: e }),
      },
      {
        name: ['multitouchstart', 'multitouchmove', 'multitouchend'],
        fn: (e: any) =>
          this.multitouch.emit({
            ymaps,
            instance: multiroute,
            type: e.originalEvent.type,
            event: e,
          }),
      },
    ];

    handlers.forEach((handler) => {
      multiroute.events.add(handler.name, (e: any) => this.ngZone.run(() => handler.fn(e)));
    });
  }

  public ngOnDestroy(): void {
    this.map.geoObjects.remove(this.multiroute);
  }
}
