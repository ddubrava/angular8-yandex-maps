/**
 * API loading parameters.
 */
export interface YaConfig {
  /**
   * API key.
   */
  apikey?: string;
  /**
   * Geosuggest API key.
   */
  suggest_apikey?: string;
  /**
   * Locale.
   */
  lang?: 'ru_RU' | 'en_US' | 'en_RU' | 'ru_UA' | 'uk_UA' | 'tr_TR';
  /**
   * The order for setting geographical coordinates in API functions that accept longitude-latitude input.
   */
  coordorder?: 'latlong' | 'longlat';
  /**
   * List of modules to load.
   */
  load?: string;
  /**
   * API loading mode.
   */
  mode?: 'release' | 'debug';
  /**
   * Enables CSP mode.
   */
  csp?: boolean;
  /**
   * Use commercial version of the API.
   */
  enterprise?: boolean;
  /**
   * Version number of the API.
   */
  version?: string;
}
