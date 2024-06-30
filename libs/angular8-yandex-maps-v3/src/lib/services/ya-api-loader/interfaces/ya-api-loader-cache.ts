/**
 * @internal
 */
export interface YaApiLoaderCache {
  /**
   * API global object.
   */
  ymaps3?: typeof ymaps3;

  /**
   * Script element that loads API.
   */
  script?: HTMLScriptElement;
}
