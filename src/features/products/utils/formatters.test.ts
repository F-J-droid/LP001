import { describe, it, expect } from 'vitest'
import { formatCurrency, formatTireSize } from './formatters'

describe('Domain Formatters', () => {
  describe('formatCurrency', () => {
    it('should format number to BRL currency string', () => {
      // Due to differences in Node.js versions, the exact space character might vary (e.g., standard space vs non-breaking space).
      // We normalize spaces for testing.
      const formatted = formatCurrency(1234.5).replace(/\s/g, ' ');
      expect(formatted).toContain('R$');
      expect(formatted).toContain('1.234,50');
    })
  })

  describe('formatTireSize', () => {
    it('should format tire dimensions into standard string', () => {
      expect(formatTireSize(205, 55, 16)).toBe('205/55 R16')
      expect(formatTireSize(225, 45, 17)).toBe('225/45 R17')
    })
  })
})
