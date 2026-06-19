export interface ViaCepResult {
  cidade: string;
  endereco: string;
  bairro: string;
}

export async function buscarCep(cep: string): Promise<ViaCepResult | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) return null;
    return {
      cidade: data.localidade || '',
      endereco: data.logradouro || '',
      bairro: data.bairro || '',
    };
  } catch {
    return null;
  }
}
