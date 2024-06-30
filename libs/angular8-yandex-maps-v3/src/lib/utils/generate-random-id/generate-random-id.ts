/**
 * Generates a random string based on Date in hexadecimal numeral system.
 * @example f175517fa4f3
 * @internal
 */
export const generateRandomId = (): string => `f${Date.now().toString(16)}`;
