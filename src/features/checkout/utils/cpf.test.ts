import { describe, it, expect } from 'vitest';
import { normalizeCpf, formatCpf, isValidCpf } from './cpf';

describe('CPF Utilities', () => {
  describe('normalizeCpf', () => {
    it('should remove non-numeric characters', () => {
      expect(normalizeCpf('123.456.789-00')).toBe('12345678900');
      expect(normalizeCpf(' 12 3 abc ')).toBe('123');
    });
  });

  describe('formatCpf', () => {
    it('should format a valid CPF string', () => {
      expect(formatCpf('12345678900')).toBe('123.456.789-00');
    });

    it('should format a partial CPF string', () => {
      expect(formatCpf('1234')).toBe('123.4');
      expect(formatCpf('1234567')).toBe('123.456.7');
    });
  });

  describe('isValidCpf', () => {
    it('should return true for valid synthetic CPFs', () => {
      expect(isValidCpf('00000000191')).toBe(true);
      expect(isValidCpf('000.000.001-91')).toBe(true);
    });

    it('should return false for invalid CPFs', () => {
      expect(isValidCpf('12345678900')).toBe(false); // Math fails
      expect(isValidCpf('123')).toBe(false); // Length fails
    });

    it('should return false for repeated digits', () => {
      expect(isValidCpf('11111111111')).toBe(false);
      expect(isValidCpf('00000000000')).toBe(false);
    });
  });
});
