export function maskCNPJ(value: string): string {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

export function maskPhone(value: string): string {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Telefone fixo (8 dígitos) ou móvel (9 dígitos)
  if (numbers.length <= 10) {
    // Telefone fixo
    return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  } else {
    // Telefone móvel
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
}

export function maskAccount(value: string): string {
  if (!value) return '';
  return value.replace(/\D/g, '').slice(0, 6);
}

export function maskAccountDV(value: string): string {
  if (!value) return '';
  return value.replace(/\D/g, '').slice(0, 2);
}

export function maskBranch(value: string): string {
  if (!value) return '';
  return value.replace(/\D/g, '').slice(0, 4);
}

export function maskBranchDV(value: string): string {
  if (!value) return '';
  return value.replace(/\D/g, '').slice(0, 2);
}

export function maskAgreement(value: string): string {
  if (!value) return '';
  return value.replace(/\D/g, '').slice(0, 20);
}