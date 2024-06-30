import { generateRandomId } from './generate-random-id';

describe('generateRandomId', () => {
  it('should generate random id', () => {
    const id = generateRandomId();
    expect(id.length).toBeGreaterThanOrEqual(12);
    expect(typeof id).toBe('string');
  });
});
