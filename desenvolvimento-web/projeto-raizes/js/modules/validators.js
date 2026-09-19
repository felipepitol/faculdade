/*
   Regras de validação do cadastro.
   Funções puras: recebem o valor e devolvem a mensagem de erro
   ou uma string vazia quando o valor é válido. Não tocam no DOM,
   por isso podem ser testadas fora do navegador.
*/

export const apenasDigitos = (valor) => String(valor ?? "").replace(/\D/g, "");

export function cpfValido(cpf) {
  const digitos = apenasDigitos(cpf);

  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) {
    return false;
  }

  const verificador = (tamanho) => {
    let soma = 0;

    for (let i = 0; i < tamanho; i++) {
      soma += Number(digitos[i]) * (tamanho + 1 - i);
    }

    const resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  };

  return (
    verificador(9) === Number(digitos[9]) &&
    verificador(10) === Number(digitos[10])
  );
}

const regras = {
  nome(valor) {
    const nome = valor.trim();

    if (!nome) return "Informe seu nome completo.";
    if (nome.length < 3) return "O nome precisa ter pelo menos 3 caracteres.";
    if (nome.split(/\s+/).length < 2) return "Informe nome e sobrenome.";

    return "";
  },

  email(valor) {
    const email = valor.trim();

    if (!email) return "Informe seu e-mail.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return "Digite um e-mail válido, como nome@exemplo.com.";
    }

    return "";
  },

  nascimento(valor, hoje = new Date()) {
    if (!valor) return "";

    const data = new Date(`${valor}T00:00:00`);

    if (Number.isNaN(data.getTime())) return "Digite uma data válida.";
    if (data > hoje) return "A data de nascimento não pode estar no futuro.";
    if (data.getFullYear() < 1900) return "Confira o ano de nascimento.";

    return "";
  },

  cpf(valor) {
    if (!valor.trim()) return "Informe seu CPF.";
    if (apenasDigitos(valor).length !== 11) return "O CPF precisa ter 11 dígitos.";
    if (!cpfValido(valor)) return "CPF inválido. Confira os números digitados.";

    return "";
  },

  telefone(valor) {
    const digitos = apenasDigitos(valor);

    if (!digitos) return "Informe um telefone para contato.";

    if (digitos.length < 10 || digitos.length > 11) {
      return "Digite o telefone com DDD, como (41) 99999-9999.";
    }

    return "";
  },

  cep(valor) {
    const digitos = apenasDigitos(valor);

    if (!digitos) return "Informe seu CEP.";
    if (digitos.length !== 8) return "O CEP precisa ter 8 dígitos.";

    return "";
  },

  estado(valor) {
    return valor ? "" : "Selecione seu estado.";
  },

  cidade(valor) {
    return valor.trim().length >= 2 ? "" : "Informe sua cidade.";
  },

  endereco(valor) {
    return valor.trim().length >= 5
      ? ""
      : "Informe seu endereço com rua e número.";
  },

  participacao(valor) {
    return valor ? "" : "Escolha uma forma de participação.";
  },
};

export const camposValidados = Object.keys(regras);

/* Valida um campo pelo nome. Campos sem regra são sempre válidos. */
export function validarCampo(nome, valor) {
  const regra = regras[nome];

  return regra ? regra(String(valor ?? "")) : "";
}

/* Valida todos os campos e devolve { campo: mensagem } só com os erros */
export function validarCadastro(dados) {
  const erros = {};

  for (const nome of camposValidados) {
    const mensagem = validarCampo(nome, dados[nome]);

    if (mensagem) erros[nome] = mensagem;
  }

  return erros;
}
