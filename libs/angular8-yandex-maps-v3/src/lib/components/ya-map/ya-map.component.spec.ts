import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';

import { mockMapConstructor, mockMapInstance } from '../../../test-utils';
import { YaConfig } from '../../interfaces/ya-config';
import { YaReadyEvent } from '../../interfaces/ya-ready-event';
import { YaApiLoaderService } from '../../services/ya-api-loader/ya-api-loader.service';
import * as GenerateRandomIdModule from '../../utils/generate-random-id/generate-random-id';
import { YaMapComponent } from './ya-map.component';

@Component({
  template: `
    <ya-map
      [center]="center"
      [zoom]="zoom"
      [state]="state"
      [options]="options"
      (yaclick)="handleClick()"
      (hintopen)="handleHintOpen()"
    ></ya-map>
  `,
})
class MockHostComponent {
  @ViewChild(YaMapComponent, { static: true }) map!: YaMapComponent;

  center?: number[];

  zoom?: number;

  state?: ymaps.IMapState;

  options?: ymaps.IMapOptions;

  handleClick(): void {}

  handleHintOpen(): void {}
}

describe('YaMapComponent', () => {
  let component: YaMapComponent;
  let mockComponent: MockHostComponent;
  let fixture: ComponentFixture<MockHostComponent>;

  let mapInstance: ReturnType<typeof mockMapInstance>;
  let mapConstructorMock: jest.Mock;

  let config$: Subject<YaConfig> = new BehaviorSubject({});

  beforeEach(async () => {
    config$ = new BehaviorSubject({});

    await TestBed.configureTestingModule({
      declarations: [MockHostComponent, YaMapComponent],
      providers: [
        {
          provide: YaApiLoaderService,
          useValue: {
            load: () => config$,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockHostComponent);
    mockComponent = fixture.componentInstance;
    component = mockComponent.map;

    mapInstance = mockMapInstance();
    mapConstructorMock = mockMapConstructor(mapInstance);
  });

  afterEach(() => {
    (window.ymaps as any) = undefined;
  });

  it('should create map', () => {
    const random = 'random_test_id';
    jest.spyOn(GenerateRandomIdModule, 'generateRandomId').mockReturnValue(random);

    fixture.detectChanges();

    expect(component.container.nativeElement.style.width).toBe('100%');
    expect(component.container.nativeElement.style.height).toBe('100%');
    expect(component.container.nativeElement.id).toBe(random);

    expect(mapConstructorMock).toHaveBeenCalledWith(random, { zoom: 10, center: [0, 0] }, {});
  });

  it('should destroy map on config changes', () => {
    fixture.detectChanges();

    config$.next({ lang: 'en_US' });
    expect(mapInstance.destroy).toHaveBeenCalled();
  });

  it('should emit ready on map load', () => {
    jest.spyOn(component.ready, 'emit');
    fixture.detectChanges();

    const readyEvent: YaReadyEvent = {
      ymaps: window.ymaps,
      target: mapInstance,
    };

    expect(component.ready.emit).toHaveBeenCalledWith(readyEvent);
  });

  it('should set default center and zoom if not passed', () => {
    fixture.detectChanges();
    expect(mapConstructorMock.mock.calls[0][1]).toEqual({
      center: [0, 0],
      zoom: 10,
    });
  });

  it('should set center and zoom', () => {
    const center = [50, 50];
    const zoom = 5;

    mockComponent.center = center;
    mockComponent.zoom = zoom;

    fixture.detectChanges();

    expect(mapConstructorMock.mock.calls[0][1]).toEqual({
      center,
      zoom,
    });
  });

  it('should not set a default zoom level if zoom is 0', () => {
    mockComponent.zoom = 0;
    fixture.detectChanges();

    expect(mapConstructorMock.mock.calls[0][1].zoom).toBe(0);
  });

  it('should set map state and options', () => {
    const state = {
      center: [50, 50],
      zoom: 5,
      controls: [],
    };

    const options = {
      restrictMapArea: [
        [50, 50],
        [60, 60],
      ],
    };

    mockComponent.state = state;
    mockComponent.options = options;

    fixture.detectChanges();

    expect(mapConstructorMock.mock.calls[0][1]).toEqual(state);
    expect(mapConstructorMock.mock.calls[0][2]).toEqual(options);
  });

  it('should give precedence to center and zoom over state', () => {
    const state = {
      center: [50, 50],
      zoom: 5,
    };

    const correctState = {
      center: [40, 40],
      zoom: 8,
    };

    mockComponent.state = state;
    mockComponent.center = correctState.center;
    mockComponent.zoom = correctState.zoom;

    fixture.detectChanges();

    expect(mapConstructorMock.mock.calls[0][1]).toEqual(correctState);
  });

  it('should set center and zoom after init', () => {
    fixture.detectChanges();

    const state = {
      center: [40, 40],
      zoom: 8,
    };

    mockComponent.center = state.center;
    mockComponent.zoom = state.zoom;

    fixture.detectChanges();

    expect(mapInstance.setCenter).toHaveBeenCalledWith(state.center);
    expect(mapInstance.setZoom).toHaveBeenCalledWith(state.zoom);
  });

  it('should give precedence to center and zoom over state after init', () => {
    const correctState = {
      center: [40, 40],
      zoom: 8,
    };

    mockComponent.center = correctState.center;
    mockComponent.zoom = correctState.zoom;

    fixture.detectChanges();

    mockComponent.state = {
      center: [10, 10],
      zoom: 8,
    };

    fixture.detectChanges();

    expect(mapInstance.setCenter).toHaveBeenCalledWith(correctState.center);
    expect(mapInstance.setZoom).toHaveBeenCalledWith(correctState.zoom);
  });

  it('should set state after init', () => {
    fixture.detectChanges();

    const state = {
      behaviors: ['default'],
      bounds: [[0, 0]],
      center: [10, 10],
      controls: ['searchControl', 'trafficControl', 'zoomControl'] as ymaps.ControlKey[],
      margin: 50,
      type: 'yandex#satellite' as const,
      zoom: 8,
    };

    mockComponent.state = state;

    fixture.detectChanges();

    expect(mapInstance.behaviors.enable).toHaveBeenCalledWith(state.behaviors);
    expect(mapInstance.setBounds).toHaveBeenCalledWith(state.bounds);
    expect(mapInstance.setCenter).toHaveBeenCalledWith(state.center);
    expect(mapInstance.controls.add).toHaveBeenCalledTimes(state.controls.length);
    expect(mapInstance.controls.add).toHaveBeenCalledWith(state.controls[0]);
    expect(mapInstance.controls.add).toHaveBeenCalledWith(state.controls[1]);
    expect(mapInstance.controls.add).toHaveBeenCalledWith(state.controls[2]);
    expect(mapInstance.behaviors.enable).toHaveBeenCalledWith(state.behaviors);
    expect(mapInstance.setZoom).toHaveBeenCalledWith(state.zoom);
  });

  it('should set options after init', () => {
    fixture.detectChanges();

    const options: ymaps.IMapOptions = {
      mapAutoFocus: true,
      nativeFullscreen: false,
      suppressObsoleteBrowserNotifier: true,
    };

    mockComponent.options = options;

    fixture.detectChanges();

    expect(mapInstance.options.set).toHaveBeenCalledWith(options);
  });

  it('should init event handlers that are set on the map', () => {
    const addMock = mapInstance.events.add;
    fixture.detectChanges();

    expect(addMock).toHaveBeenCalledWith('click', expect.any(Function));
    expect(addMock).toHaveBeenCalledWith('hintopen', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('actionbegin', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('actionbreak', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('actionend', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('actiontick', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('actiontickcomplete', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('balloonclose', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('balloonopen', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('boundschange', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('contextmenu', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('dblclick', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('destroy', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('hintclose', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('marginchange', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('mouseleave', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('multitouchend', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('multitouchmove', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('multitouchstart', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('optionschange', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('sizechange', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('typechange', expect.any(Function));
    expect(addMock).not.toHaveBeenCalledWith('wheel', expect.any(Function));
  });

  it('should be able to add an event listener after init', () => {
    const addMock = mapInstance.events.add;
    fixture.detectChanges();

    expect(addMock).not.toHaveBeenCalledWith('multitouchend', expect.any(Function));

    // Pick an event that isn't bound in the template.
    const subscription = mockComponent.map.multitouchend.subscribe();
    fixture.detectChanges();

    expect(addMock).toHaveBeenCalledWith('multitouchend', expect.any(Function));
    subscription.unsubscribe();
  });
});
