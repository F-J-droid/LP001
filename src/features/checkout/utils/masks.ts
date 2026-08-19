export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function formatPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  
  if (normalized.length <= 10) {
    return normalized
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
  
  // 11 digits: (XX) XXXXX-XXXX
  return normalized
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return normalized.length === 10 || normalized.length === 11;
}

export function normalizeZipCode(zip: string): string {
  return zip.replace(/\D/g, '');
}

export function formatZipCode(zip: string): string {
  const normalized = normalizeZipCode(zip);
  return normalized
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
}

export function isValidZipCode(zip: string): boolean {
  return normalizeZipCode(zip).length === 8;
}
