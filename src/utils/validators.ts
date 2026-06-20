export function validarCpfCnpj(valor: string): string | null {
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length === 11) return validarCpf(digitos);
  if (digitos.length === 14) return validarCnpj(digitos);
  return "CPF/CNPJ inválido";
}

function validarCpf(cpf: string): string | null {
  if (/^(\d)\1{10}$/.test(cpf)) return "CPF inválido";
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[9])) return "CPF inválido";
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[10])) return "CPF inválido";
  return null;
}

function validarCnpj(cnpj: string): string | null {
  if (/^(\d)\1{13}$/.test(cnpj)) return "CNPJ inválido";
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) soma += parseInt(cnpj[i]) * pesos1[i];
  let resto = soma % 11;
  if (resto < 2) resto = 0; else resto = 11 - resto;
  if (resto !== parseInt(cnpj[12])) return "CNPJ inválido";
  soma = 0;
  for (let i = 0; i < 13; i++) soma += parseInt(cnpj[i]) * pesos2[i];
  resto = soma % 11;
  if (resto < 2) resto = 0; else resto = 11 - resto;
  if (resto !== parseInt(cnpj[13])) return "CNPJ inválido";
  return null;
}

export interface ValidacaoFormulario {
  nome?: string;
  email?: string;
  senha?: string;
  cep?: string;
  cidade?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cpf_cnpj?: string;
}

export function validarFormulario(
  dados: Record<string, string>,
  planosPagos: boolean,
): ValidacaoFormulario {
  const erros: ValidacaoFormulario = {};

  if (!dados.nome?.trim()) erros.nome = "Nome é obrigatório";
  if (!dados.email?.trim()) erros.email = "Email é obrigatório";
  else if (!/\S+@\S+\.\S+/.test(dados.email)) erros.email = "Email inválido";
  if (!dados.senha?.trim()) erros.senha = "Senha é obrigatória";
  else if (dados.senha.length < 6) erros.senha = "Mínimo 6 caracteres";

  if (planosPagos) {
    if (!dados.cep?.trim()) erros.cep = "CEP é obrigatório";
    if (!dados.cidade?.trim()) erros.cidade = "Cidade é obrigatória";
    if (!dados.endereco?.trim()) erros.endereco = "Endereço é obrigatório";
    if (!dados.numero?.trim()) erros.numero = "Número é obrigatório";
    if (!dados.bairro?.trim()) erros.bairro = "Bairro é obrigatório";
  }

  if (dados.cpf_cnpj?.trim()) {
    const erroCpf = validarCpfCnpj(dados.cpf_cnpj);
    if (erroCpf) erros.cpf_cnpj = erroCpf;
  }

  return erros;
}
