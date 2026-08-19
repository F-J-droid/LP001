import { createHash } from 'crypto';

/**
 * Normalizes an email address according to Meta's hashing requirements:
 * - Trims leading/trailing whitespace
 * - Converts to lowercase
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Normalizes a phone number according to Meta's hashing requirements:
 * - Removes all non-numeric characters (like +, -, (, ), spaces)
 * - Must include the country code
 */
export function normalizePhone(phone: string, defaultCountryCode = '55'): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10 && cleaned.length <= 11 && !cleaned.startsWith('55')) {
    cleaned = `${defaultCountryCode}${cleaned}`;
  }
  return cleaned;
}

/**
 * Hashes a string using SHA-256 and returns the hex representation.
 * Meta CAPI requires PII (like email and phone) to be hashed in SHA-256.
 */
export function hashSha256(value: string): string {
  if (!value) return '';
  return createHash('sha256').update(value).digest('hex');
}
