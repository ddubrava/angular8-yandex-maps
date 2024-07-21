# YaMapComponent


The `ya-map` component wraps `ymaps.Map` class from the Yandex.Maps API.
You can configure the map via the component's inputs.
Events can be bound using the outputs of the component.



```html
<ya-map
  [center]="[55.751952, 37.600739]"
  [state]="{type: 'yandex#satellite'}"
></ya-map>
```


## Example
[filename](https://stackblitz.com/edit/map-onload-event?embed=1&view=preview ':include :type=iframe width=100% height=650px')

## Inputs
| Name    | Description                                                                                                                    | Type              | API Reference                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| center  |   Geo coordinates of the map center. Default is `[0, 0]`. Shorthand for `[state]="{ center: [0, 0] }"`.                        | number[]          | [Map.html#Map__param-state.center](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#Map__param-state.center) |
| options |   Map options. The map options can be used to make settings for the map itself, as well as for objects that are added to it.   | ymaps.IMapOptions | [Map.html#Map__param-options](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#Map__param-options)           |
| state   |   Map parameters.                                                                                                              | ymaps.IMapState   | [Map.html#Map__param-state](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#Map__param-state)               |
| zoom    |   Map zoom level. Default level is `10`. Shorthand for `[state]="{ zoom: 10 }"`.                                               | number            | [Map.html#Map__param-state.zoom](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#Map__param-state.zoom)     |

## Outputs
| Name               | Description                                                          | Type                                  | API Reference                                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| actionbegin        |   The start of a new smooth map movement.                            | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-actionbegin](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actionbegin)                                   |
| actionbreak        |   Event that occurs when an action step was prematurely stopped.     | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-actionbreak](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actionbreak)                                   |
| actionend          |   The end of smooth map movement.                                    | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-actionend](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actionend)                                       |
| actiontick         |   The start of a new step of smooth movement.                        | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-actiontick](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actiontick)                                     |
| actiontickcomplete |   The end of performing a step of smooth movement.                   | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-actiontickcomplete](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-actiontickcomplete)                     |
| balloonclose       |   Closing the balloon.                                               | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-balloonclose](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-balloonclose)                                 |
| balloonopen        |   Opening a balloon on a map.                                        | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-balloonopen](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-balloonopen)                                   |
| boundschange       |   Event for a change to the map viewport.                            | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-boundschange](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-boundschange)                                 |
| destroy            |   The map was destroyed.                                             | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-destroy](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-destroy)                                           |
| hintclose          |   Closing the hint.                                                  | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-hintclose](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-hintclose)                                       |
| hintopen           |   Opening a hint on a map.                                           | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-hintopen](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-hintopen)                                         |
| marginchange       |   Map margins changed.                                               | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-marginchange](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-marginchange)                                 |
| multitouchend      |   End of multitouch.                                                 | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-multitouchend](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-multitouchend)     |
| multitouchmove     |   Repeating event during multitouch.                                 | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-multitouchmove](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-multitouchmove)   |
| multitouchstart    |   Start of multitouch.                                               | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-multitouchstart](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-multitouchstart) |
| optionschange      |   Map options changed.                                               | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-optionschange](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-optionschange)                               |
| ready              |   Map instance is created. This event runs outside an Angular zone.  | EventEmitter<YaReadyEvent<ymaps.Map>> | —                                                                                                                                                                              |
| sizechange         |   Map size changed.                                                  | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-sizechange](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-sizechange)                                     |
| typechange         |   The map type changed.                                              | Observable<YaEvent<ymaps.Map>>        | [Map.html#event_detail__event-typechange](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/Map.html#event_detail__event-typechange)                                     |
| yaclick            |   Single left-click on the object.                                   | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-click](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-click)                     |
| yacontextmenu      |   Calls the element's context menu.                                  | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-contextmenu](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-contextmenu)         |
| yadblclick         |   Double left-click on the object.                                   | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-dblclick](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-dblclick)               |
| yamousedown        |   Pressing the mouse button over the object.                         | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-mousedown](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mousedown)             |
| yamouseenter       |   Pointing the cursor at the object.                                 | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-mouseenter](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mouseenter)           |
| yamouseleave       |   Moving the cursor off of the object.                               | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-mouseleave](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mouseleave)           |
| yamousemove        |   Moving the cursor over the object.                                 | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-mousemove](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mousemove)             |
| yamouseup          |   Letting go of the mouse button over an object.                     | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-mouseup](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-mouseup)                 |
| yawheel            |   Mouse wheel scrolling.                                             | Observable<YaEvent<ymaps.Map>>        | [IDomEventEmitter.html#event_detail__event-wheel](https://yandex.com/dev/maps/jsapi/doc/2.1/ref/reference/IDomEventEmitter.html#event_detail__event-wheel)                     |