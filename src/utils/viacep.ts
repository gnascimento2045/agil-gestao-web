export interface ViaCepResult {
  cidade: string;
  endereco: string;
  bairro: string;
  valido: boolean;
}

export async function buscarCep(cep: string): Promise<ViaCepResult> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) {
      return { cidade: '', endereco: '', bairro: '', valido: false };
    }
    return {
      cidade: data.localidade || '',
      endereco: data.logradouro || '',
      bairro: data.bairro || '',
      valido: true,
    };
  } catch {
    return { cidade: '', endereco: '', bairro: '', valido: false };
  }
}
