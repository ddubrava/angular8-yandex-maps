/**
 * Copied from angular/components/google-maps and updated for Yandex.Maps API.
 * {@link https://github.com/angular/components/blob/main/src/google-maps/map-event-manager.ts}
 */

// TODO see this https://github.com/angular/components/commits/main/src/google-maps/map-event-manager.ts

import { NgZone } from '@angular/core';
import { DomEventHandler, YMap, YMapListener } from '@yandex/ymaps3-types';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { YaEvent } from '../../interfaces/ya-event';

/**
 * @internal
 */
type EventManagerTarget = {
  addChild: YMap['addChild'];
};

/**
 * Manages event on a Yandex.Maps object, ensuring that events are added only when necessary.
 * @internal
 */
export class EventManager {
  /**
   * Listeners that were added before the target was set.
   */
  private pending: {
    observable: Observable<any>;
    observer: Subscriber<any>;
  }[] = [];

  private listeners: {
    name: string;
    callback: (e: DomEventHandler) => void;
    listener: YMapListener;
  }[] = [];

  private readonly targetStream = new BehaviorSubject<EventManagerTarget | undefined>(undefined);

  constructor(private readonly ngZone: NgZone) {}

  /**
   * Gets an observable that adds an event listener to the map when a consumer subscribes to it.
   * @param name
   */
  getLazyEmitter(name: string): Observable<YaEvent> {
    return this.targetStream.pipe(
      switchMap((target) => {
        const observable = new Observable<YaEvent>((observer) => {
          // If the target hasn't been initialized yet, cache the observer, so it can be added later.
          if (!target) {
            this.pending.push({ observable, observer });
            return undefined;
          }

          const callback = (event: DomEventHandler) => {
            const e = {
              event,
              target,
              ymaps3,
            };

            this.ngZone.run(() => observer.next(e));
          };

          const listener = new ymaps3.YMapListener({
            layer: 'any',
            [name]: callback,
          });

          target.addChild(listener);

          this.listeners.push({ name, callback, listener });

          // Unsubscribe function
          return () => listener.update({ layer: 'any', [name]: null });
        });

        return observable;
      }),
    );
  }

  /**
   * Sets the current target that the manager should bind events to.
   * @param target
   */
  setTarget(target: EventManagerTarget): void {
    const currentTarget = this.targetStream.value;

    if (target === currentTarget) {
      return;
    }

    // Clear the listeners from the pre-existing target.
    if (currentTarget) {
      this.clearListeners();
      this.pending = [];
    }

    this.targetStream.next(target);

    // Add the listeners that were bound before the map was initialized.
    this.pending.forEach((subscriber) => subscriber.observable.subscribe(subscriber.observer));

    this.pending = [];
  }

  /**
   * Destroys the manager and clears the event listeners.
   */
  destroy(): void {
    this.clearListeners();
    this.pending = [];
    this.targetStream.complete();
  }

  /**
   * Clears all currently-registered event listeners.
   */
  private clearListeners() {
    this.listeners.forEach((listener) => {
      listener.listener.update({ [listener.name]: null });
    });

    this.listeners = [];
  }
}
