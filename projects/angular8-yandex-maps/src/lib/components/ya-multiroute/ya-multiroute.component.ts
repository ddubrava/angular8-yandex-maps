import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IEvent, ILoadEvent } from '../../models/models';

import { generateRandomId } from '../../utils/generateRandomId';

@Component({
  selector: 'ya-multiroute',
  templateUrl: './ya-multiroute.component.html',
  styleUrls: ['./ya-multiroute.component.scss']
})
export class YaMultirouteComponent implements OnInit, OnChanges {
  @Input() public referencePoints: Array<any>;
  @Input() public model: any;
  @Input() public options: any;

  @Output() public load = new EventEmitter<ILoadEvent>();
  @Output() public activeroutechange = new EventEmitter<IEvent>();
  @Output() public baloon = new EventEmitter<IEvent>();
  @Output() public yaclick = new EventEmitter<IEvent>();
  @Output() public mouse = new EventEmitter<IEvent>();
  @Output() public multitouch = new EventEmitter<IEvent>();

  public id: string;

  // Yandex.Map API
  private _map: any;
  private _multiroute: any;

  constructor() { }

  public ngOnInit(): void {
    this._logErrors();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._configMultiroute(changes);
  }

  /**
   * Method for dynamic entity configuration.
   * Handles input changes and provides it to API.
   * @param changes
   */
  private _configMultiroute(changes: SimpleChanges): void {
    const multiroute = this._multiroute;

    if (!multiroute) return;

    const { referencePoints, model, options } = changes;

    if (referencePoints) {
      multiroute.model.setReferencePoints(referencePoints.currentValue);
    }

    if (model) {
      this._setModel(model.currentValue, multiroute);
    }

    if (options) {
      multiroute.options.set(options.currentValue);
    }
  }

  /**
   * Destructuring model and provides new values to API
   * @param model - https://tech.yandex.com/maps/jsapi/doc/2.1/ref/reference/multiRouter.MultiRouteModel-docpage/
   * @param multiroute
   */
  private _setModel(model: any, multiroute: any): void {
    const { referencePoints, params } = model;

    if (referencePoints) {
      multiroute.model.setReferencePoints(referencePoints);
    }

    if (params) {
      multiroute.model.setParams(params);
    }
  }

  private _logErrors(): void {
    if (!this.referencePoints) {
      console.error('Multiroute: referencePoints input is required.');
      this.referencePoints = [];
    }
  }

  public initMultiroute(ymaps: any, map: any): void {
    const multiroute = new ymaps.multiRouter.MultiRoute(
      { ...this.model, referencePoints: this.referencePoints }, this.options
    );

    this.id = generateRandomId();
    this._map = map;
    this._multiroute = multiroute;

    map.geoObjects.add(multiroute);
    this._emitEvents(ymaps, multiroute);
  }

  /**
   * Add listeners on placemark events
   * @param ymaps
   * @param map
   */
  private _emitEvents(ymaps: any, multiroute: any): void {
    this.load.emit({ ymaps, instance: multiroute });

    // Activeroutechange
    multiroute.events
      .add(
        'activeroutechange',
        (e: any) => this.activeroutechange.emit({ ymaps, instance: multiroute, type: e.originalEvent.type, event: e })
      );

    // Baloon
    multiroute.events
      .add(
        ['balloonopen', 'balloonclose'],
        (e: any) => this.baloon.emit({ ymaps, instance: multiroute, type: e.originalEvent.type, event: e })
      );

    // Click
    multiroute.events
      .add(
        ['click', 'dblclick'],
        (e: any) => this.yaclick.emit({ ymaps, instance: multiroute, type: e.originalEvent.type, event: e })
      );

    // Mouse
    multiroute.events
      .add(
        ['mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseup'],
        (e: any) => this.mouse.emit({ ymaps, instance: multiroute, type: e.originalEvent.type, event: e })
      );

    // Multitouch
    multiroute.events
      .add(
        ['multitouchstart', 'multitouchmove', 'multitouchend'],
        (e: any) => this.multitouch.emit({ ymaps, instance: multiroute, type: e.originalEvent.type, event: e })
      );
  }

  public ngOnDestroy(): void {
    this._map.geoObjects.remove(this._multiroute);
  }
}