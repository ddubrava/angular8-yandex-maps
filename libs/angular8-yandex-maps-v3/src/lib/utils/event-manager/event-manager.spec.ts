import { NgZone } from '@angular/core';

import { EventManager } from './event-manager';

/**
 * Imitates a Yandex.Maps event target and keeps track of the registered events.
 */
class TestEventTarget {
  currentEvents = new Map<string, Set<() => void>>();

  events = {
    add: jest.fn((name: string, listener: () => void) => {
      if (!this.currentEvents.has(name)) {
        this.currentEvents.set(name, new Set());
      }

      this.currentEvents.get(name)!.add(listener);

      return { remove: () => this.currentEvents.get(name)!.delete(listener) };
    }),
  } as any;

  triggerListeners(name: string) {
    const listeners = this.currentEvents.get(name);

    if (!listeners) {
      throw Error(`No listeners registered for "${name}" event.`);
    }

    listeners.forEach((listener) => listener());
  }
}

describe('EventManager', () => {
  let dummyZone: NgZone;
  let manager: EventManager;
  let target: TestEventTarget;

  beforeEach(() => {
    dummyZone = {
      run: jest.fn((callback: () => void) => callback()),
    } as unknown as NgZone;

    target = new TestEventTarget();
    manager = new EventManager(dummyZone);

    // Need to define window.ymaps as we return it in YaEvent
    (window.ymaps as any) = {};
  });

  afterEach(() => {
    manager.destroy();
    (window.ymaps as any) = undefined;
  });

  it('should return undefined if a target equals to a currentTarget', () => {
    manager.setTarget(target);
    expect(manager.setTarget(target)).toBe(undefined);
  });

  it('should register a listener when subscribing to an event', () => {
    expect(target.events.add).not.toHaveBeenCalled();

    manager.setTarget(target);
    const stream = manager.getLazyEmitter('click');

    expect(target.events.add).not.toHaveBeenCalled();
    expect(target.currentEvents.get('click')).toBeFalsy();

    const subscription = stream.subscribe();
    expect(target.events.add).toHaveBeenCalledTimes(1);
    expect(target.currentEvents.get('click')?.size).toBe(1);
    subscription.unsubscribe();
  });

  it('should register a listener if the subscription happened before there was a target', () => {
    const stream = manager.getLazyEmitter('click');
    const subscription = stream.subscribe();

    expect(target.events.add).not.toHaveBeenCalled();
    expect(target.currentEvents.get('click')).toBeFalsy();

    manager.setTarget(target);

    expect(target.events.add).toHaveBeenCalledTimes(1);
    expect(target.currentEvents.get('click')?.size).toBe(1);
    subscription.unsubscribe();
  });

  it('should remove the listener when unsubscribing', () => {
    const stream = manager.getLazyEmitter('click');
    const subscription = stream.subscribe();

    manager.setTarget(target);
    expect(target.currentEvents.get('click')?.size).toBe(1);

    subscription.unsubscribe();
    expect(target.currentEvents.get('click')?.size).toBe(0);
  });

  it('should remove the listener when the manager is destroyed', () => {
    const stream = manager.getLazyEmitter('click');

    stream.subscribe();
    manager.setTarget(target);
    expect(target.currentEvents.get('click')?.size).toBe(1);

    manager.destroy();
    expect(target.currentEvents.get('click')?.size).toBe(0);
  });

  it('should remove the listener when the target is changed', () => {
    const stream = manager.getLazyEmitter('click');

    stream.subscribe();
    manager.setTarget(target);
    expect(target.currentEvents.get('click')?.size).toBe(1);

    manager.setTarget(undefined!);
    expect(target.currentEvents.get('click')?.size).toBe(0);
  });

  it('should trigger the subscription to an event', () => {
    const mock = jest.fn();
    const stream = manager.getLazyEmitter('click');

    stream.subscribe(mock);
    manager.setTarget(target);
    expect(mock).not.toHaveBeenCalled();

    target.triggerListeners('click');
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('should be able to register multiple listeners to the same event', () => {
    const firstMock = jest.fn();
    const secondMock = jest.fn();
    const stream = manager.getLazyEmitter('click');

    manager.setTarget(target);
    stream.subscribe(firstMock);
    stream.subscribe(secondMock);

    expect(firstMock).not.toHaveBeenCalled();
    expect(secondMock).not.toHaveBeenCalled();
    expect(target.currentEvents.get('click')?.size).toBe(2);

    target.triggerListeners('click');
    expect(firstMock).toHaveBeenCalledTimes(1);
    expect(secondMock).toHaveBeenCalledTimes(1);
  });

  it('should run listeners inside the NgZone', () => {
    const mock = jest.fn();
    const stream = manager.getLazyEmitter('click');

    stream.subscribe(mock);
    manager.setTarget(target);

    expect(dummyZone.run).not.toHaveBeenCalled();

    target.triggerListeners('click');
    expect(dummyZone.run).toHaveBeenCalledTimes(1);
  });

  it('should maintain subscriptions when swapping out targets', () => {
    const mock = jest.fn();
    const stream = manager.getLazyEmitter('click');

    stream.subscribe(mock);
    manager.setTarget(target);

    expect(mock).not.toHaveBeenCalled();

    target.triggerListeners('click');
    expect(mock).toHaveBeenCalledTimes(1);

    const alternateTarget = new TestEventTarget();
    manager.setTarget(alternateTarget);

    expect(mock).toHaveBeenCalledTimes(1);
    expect(target.currentEvents.get('click')?.size).toBe(0);
    expect(alternateTarget.currentEvents.get('click')?.size).toBe(1);

    alternateTarget.triggerListeners('click');
    expect(mock).toHaveBeenCalledTimes(2);

    manager.setTarget(undefined!);
    expect(alternateTarget.currentEvents.get('click')?.size).toBe(0);

    alternateTarget.triggerListeners('click');
    expect(mock).toHaveBeenCalledTimes(2);
  });
});
