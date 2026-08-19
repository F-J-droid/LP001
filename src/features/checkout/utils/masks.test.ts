import { describe, it, expect } from 'vitest';
import { formatPhone, isValidPhone, formatZipCode, isValidZipCode } from './masks';

describe('Mask Utilities', () => {
  describe('Phone', () => {
    it('should format 10 digit phone', () => {
      expect(formatPhone('2233334444')).toBe('(22) 3333-4444');
    });

    it('should format 11 digit phone', () => {
      expect(formatPhone('22999998888')).toBe('(22) 99999-8888');
    });

    it('should validate phone', () => {
      expect(isValidPhone('22999998888')).toBe(true);
      expect(isValidPhone('123')).toBe(false);
    });
  });

  describe('ZipCode', () => {
    it('should format zip code', () => {
      expect(formatZipCode('28890000')).toBe('28890-000');
    });

    it('should validate zip code', () => {
      expect(isValidZipCode('28890000')).toBe(true);
      expect(isValidZipCode('28890-000')).toBe(true);
      expect(isValidZipCode('123')).toBe(false);
    });
  });
});
