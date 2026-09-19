/*
   Cadastros enviados: gravação no localStorage e lista na tela.
*/

import { participacoes } from "../data/formulario.js";
import { listaCadastrosTemplate } from "../templates/cadastro.js";
import { aplicarTempoRelativo } from "./datas.js";
import { CHAVES, ler, salvar } from "./storage.js";
import { apenasDigitos } from "./validators.js";

const ROTULOS_PARTICIPACAO = Object.fromEntries(participacoes);

/*
   O localStorage pode ser editado fora da aplicação, então o conteúdo lido
   é conferido: só entram na lista itens que são objetos com id e nome.
*/
export function listarCadastros() {
  const salvos = ler(CHAVES.cadastros, []);

  if (!Array.isArray(salvos)) return [];

  return salvos.filter(
    (item) => item && typeof item === "object" && item.id && item.nome,
  );
}

/*
   Guarda só o necessário para a lista. O CPF não é salvo inteiro:
   ficam apenas os três dígitos centrais, como em um comprovante.
*/
export function adicionarCadastro(dados) {
  const cpf = apenasDigitos(dados.cpf);

  const cadastro = {
    id: String(Date.now()),
    nome: dados.nome.trim(),
    email: dados.email.trim(),
    cpf: `***.${cpf.slice(3, 6)}.***-**`,
    cidade: dados.cidade.trim(),
    estado: dados.estado,
    participacao: dados.participacao,
    enviadoEm: new Date().toISOString(),
  };

  return salvar(CHAVES.cadastros, [cadastro, ...listarCadastros()]);
}

export function removerCadastro(id) {
  salvar(
    CHAVES.cadastros,
    listarCadastros().filter((cadastro) => cadastro.id !== id),
  );
}

/* Renderiza a lista e trata o botão "Remover". Devolve a função de atualização. */
export function iniciarListaCadastros(raiz) {
  const saida = raiz.querySelector("#lista-cadastros");

  const atualizar = () => {
    saida.innerHTML = listaCadastrosTemplate(
      listarCadastros(),
      ROTULOS_PARTICIPACAO,
    );

    aplicarTempoRelativo(saida);
  };

  saida.addEventListener("click", ({ target }) => {
    const botao = target.closest("[data-remover]");

    if (!botao) return;

    removerCadastro(botao.dataset.remover);
    atualizar();
  });

  atualizar();

  return atualizar;
}
