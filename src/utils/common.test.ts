import { sum } from './common';

describe('Test common utils', () => {
  describe('sum', () => {
    it('Should sum up two numbers', () => {
      expect(sum(1, 3)).toBe(4);
    });
  });
});
