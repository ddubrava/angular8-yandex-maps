/**
 * A component `(ready)` output event.
 */
export interface YaReadyEvent<T = any> {
  /**
   * Instance of a target.
   */
  target: T;
  /**
   * API global object.
   */
  ymaps3?: typeof ymaps3;
}
