import { generateHash, generateHexColor } from '.';

describe('utils/common', () => {
  describe('generateHash', () => {
    it('Should generate a random hash', () => {
      const hash = [
        generateHash(),
        generateHash(),
        generateHash(),
        generateHash(),
      ];
      const regex = /^[a-f0-9]{12}$/;
      expect(regex.test(hash[0])).toBe(true);
      expect(regex.test(hash[1])).toBe(true);
      expect(regex.test(hash[2])).toBe(true);
      expect(regex.test(hash[3])).toBe(true);
    });
  });
  describe('generateHexColor', () => {
    it('Should generate a random hex color', () => {
      const hash = [
        generateHexColor(),
        generateHexColor(),
        generateHexColor(),
        generateHexColor(),
      ];
      const regex = /^#[a-fA-F0-9]{6}$/;
      expect(regex.test(hash[0])).toBe(true);
      expect(regex.test(hash[1])).toBe(true);
      expect(regex.test(hash[2])).toBe(true);
      expect(regex.test(hash[3])).toBe(true);
    });
  });
});
