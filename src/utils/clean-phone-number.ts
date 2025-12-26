/**
 * Remove todos os caracteres não numéricos de um número de telefone
 * @param phone - Número de telefone com ou sem formatação
 * @returns Número de telefone apenas com dígitos
 *
 * @example
 * cleanPhoneNumber("(11) 97668-7694") // "11976687694"
 * cleanPhoneNumber("11 97668 7694") // "11976687694"
 * cleanPhoneNumber("11976687694") // "11976687694"
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}
