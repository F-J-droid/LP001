export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export function formatCpf(cpf: string): string {
  const normalized = normalizeCpf(cpf);
  return normalized
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

export function isValidCpf(cpf: string): boolean {
  const normalized = normalizeCpf(cpf);

  if (normalized.length !== 11) {
    return false;
  }

  // Check for repeated digits
  if (/^(\d)\1+$/.test(normalized)) {
    return false;
  }

  // Validate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(normalized.charAt(i)) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(normalized.charAt(9))) return false;

  // Validate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(normalized.charAt(i)) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(normalized.charAt(10))) return false;

  return true;
}
