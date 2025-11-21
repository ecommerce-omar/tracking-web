/**
 * CPF validation utilities
 * Validates Brazilian CPF (Cadastro de Pessoas Físicas) format and check digit
 */

/**
 * Remove non-numeric characters from CPF
 */
export const cleanCpf = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

/**
 * Format CPF with mask (XXX.XXX.XXX-XX)
 */
export const formatCpf = (cpf: string): string => {
  const cleaned = cleanCpf(cpf);
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Validate CPF check digits
 */
export const isValidCpf = (cpf: string): boolean => {
  const cleaned = cleanCpf(cpf);

  // Check if CPF has 11 digits
  if (cleaned.length !== 11) {
    return false;
  }

  // Check for known invalid CPFs (all digits the same)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return false;
  }

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) {
    return false;
  }

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) {
    return false;
  }

  return true;
};
