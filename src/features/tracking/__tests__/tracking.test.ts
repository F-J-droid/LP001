import { describe, it, expect } from 'vitest';
import { centsToDecimal } from '../utils/money-helpers';
import { normalizeEmail, normalizePhone, hashSha256 } from '../utils/hash-helpers';

describe('Tracking Helpers', () => {
  describe('money-helpers', () => {
    it('centsToDecimal should convert correctly', () => {
      expect(centsToDecimal(100)).toBe(1.00);
      expect(centsToDecimal(49990)).toBe(499.90);
      expect(centsToDecimal(0)).toBe(0);
      expect(centsToDecimal(NaN)).toBe(0);
    });
  });

  describe('hash-helpers', () => {
    it('normalizeEmail should trim and lowercase', () => {
      expect(normalizeEmail(' Test@Example.com ')).toBe('test@example.com');
      expect(normalizeEmail('')).toBe('');
    });

    it('normalizePhone should remove non-digits and add country code if missing', () => {
      expect(normalizePhone('(11) 98765-4321')).toBe('5511987654321');
      expect(normalizePhone('+55 (11) 98765-4321')).toBe('5511987654321');
      expect(normalizePhone('11987654321')).toBe('5511987654321');
      expect(normalizePhone('123')).toBe('123'); // Less than 10 digits
    });

    it('hashSha256 should produce correct hex string', () => {
      // test@example.com -> 973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b
      expect(hashSha256('test@example.com')).toBe('973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b');
    });
  });
});
