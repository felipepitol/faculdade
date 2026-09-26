/*
   Camada sobre o localStorage.
   Centraliza as chaves, a conversão para JSON e o tratamento de falhas
   (navegação privada, armazenamento cheio ou bloqueado).
*/

const PREFIXO = "raizes:";

export const CHAVES = {
  rascunho: "rascunho",
  cadastros: "cadastros",
  contraste: "contraste",
};

export function ler(chave, padrao = null) {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave);

    return bruto === null ? padrao : JSON.parse(bruto);
  } catch {
    return padrao;
  }
}

export function salvar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));

    return true;
  } catch {
    return false;
  }
}

export function remover(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
    /* sem armazenamento disponível: nada a remover */
  }
}
