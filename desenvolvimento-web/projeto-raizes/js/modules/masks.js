/*
   Máscaras de digitação.
   Cada função recebe o texto digitado e devolve o texto formatado.
*/

import { apenasDigitos } from "./validators.js";

export const mascaras = {
  cpf(valor) {
    return apenasDigitos(valor)
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  },

  telefone(valor) {
    let digitos = apenasDigitos(valor);

    /* Número colado com o código do país (+55): descarta o prefixo */
    if (digitos.length > 11 && digitos.startsWith("55")) {
      digitos = digitos.slice(2);
    }

    digitos = digitos.slice(0, 11);

    if (digitos.length <= 2) return digitos.replace(/(\d{1,2})/, "($1");

    const ddd = `(${digitos.slice(0, 2)}) `;
    const numero = digitos.slice(2);
    const corte = numero.length > 8 ? 5 : 4;

    return numero.length > corte
      ? `${ddd}${numero.slice(0, corte)}-${numero.slice(corte)}`
      : ddd + numero;
  },

  cep(valor) {
    return apenasDigitos(valor)
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, "$1-$2");
  },
};

/* Aplica a máscara indicada em data-mascara, se existir */
export function aplicarMascara(campo) {
  const mascara = mascaras[campo.dataset.mascara];

  if (mascara) campo.value = mascara(campo.value);
}
