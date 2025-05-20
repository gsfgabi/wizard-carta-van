import * as Yup from 'yup';

/**
 * Valida se um CNPJ é válido.
 * @param cnpj CNPJ em string
 * @returns boolean
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/[^\d]+/g, '');
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false; 

  const calcDV = (base: string, pesoInicial: number): number => {
    let soma = 0;
    let peso = pesoInicial;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i]) * peso--;
      if (peso < 2) peso = 9;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base = cleaned.slice(0, 12);
  const dv1 = calcDV(base, 5);
  const dv2 = calcDV(base + dv1, 6);

  return cleaned === base + dv1.toString() + dv2.toString();
}

/**
 * Valida se o token é válido.
 * @param token Token em string
 * @returns boolean
 */
export function isValidToken(token: string): boolean {
  return typeof token === 'string' && token.length >= 6;
}

// Função auxiliar para validar telefone
const validatePhone = (value: string) => {
  if (!value) return false;
  
  const numbers = value.replace(/\D/g, '');
  
  // Telefone fixo (8 dígitos) ou móvel (9 dígitos)
  if (numbers.length === 10) {
    // Telefone fixo
    return /^\d{2}[2-5]\d{7}$/.test(numbers);
  } else if (numbers.length === 11) {
    // Telefone móvel
    return /^\d{2}9\d{8}$/.test(numbers);
  }
  
  return false;
};

export const formValidationSchema = Yup.object().shape({
  cnpj: Yup.string()
    .required('CNPJ é obrigatório')
    .matches(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/, 'CNPJ inválido'),
  corporate_name: Yup.string().required('Razão Social é obrigatória'),
  responsible_person_name: Yup.string().required('Nome do Responsável é obrigatório'),
  responsible_person_position: Yup.string().required('Cargo do Responsável é obrigatório'),
  responsible_person_cellphone: Yup.string()
    .required('Telefone é obrigatório')
    .test('phone', 'Telefone inválido - Use o formato (DDD) XXXX-XXXX para fixo ou (DDD) 9XXXX-XXXX para móvel', validatePhone),
  responsible_person_email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  branch_number: Yup.string()
    .required('Agência é obrigatória')
    .matches(/^\d{4}$/, 'Agência deve conter 4 dígitos'),
  branch_dv: Yup.string()
    .matches(/^\d{1,2}$/, 'DV da agência deve conter 1 ou 2 dígitos'),
  account_number: Yup.string()
    .required('Conta é obrigatória')
    .matches(/^\d{6}$/, 'Conta deve conter 6 dígitos'),
  account_dv: Yup.string()
    .required('DV da Conta é obrigatório')
    .matches(/^\d{1,2}$/, 'DV da conta deve conter 1 ou 2 dígitos'),
  agreement_number: Yup.string()
    .required('Convênio é obrigatório')
    .matches(/^\d+$/, 'Convênio deve conter apenas números'),
  cnab: Yup.string().required('CNAB é obrigatório'),
  manager_name: Yup.string().required('Nome do Gerente é obrigatório'),
  manager_cellphone: Yup.string()
    .required('Telefone do Gerente é obrigatório')
    .test('phone', 'Telefone inválido - Use o formato (DDD) XXXX-XXXX para fixo ou (DDD) 9XXXX-XXXX para móvel', validatePhone),
  manager_email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail do Gerente é obrigatório'),
  bank: Yup.string().required('Banco é obrigatório'),
});

