/*
   Ponto de entrada da aplicação.
   Define as rotas e conecta o roteador ao cabeçalho.
*/

import { iniciarListaCadastros } from "./modules/cadastros.js";
import { iniciarFormulario } from "./modules/form.js";
import { fecharMenus, marcarLinkAtivo, posicionarConteudo } from "./modules/nav.js";
import { criarRoteador } from "./modules/router.js";
import { cadastroTemplate } from "./templates/cadastro.js";
import { homeTemplate } from "./templates/home.js";
import { naoEncontradaTemplate } from "./templates/naoEncontrada.js";
import { projetosTemplate } from "./templates/projetos.js";

const rotas = {
  "": {
    titulo: "Projeto Raízes",
    template: homeTemplate,
  },

  projetos: {
    titulo: "Projetos | Projeto Raízes",
    template: projetosTemplate,
  },

  cadastro: {
    titulo: "Participe | Projeto Raízes",
    template: cadastroTemplate,

    iniciar(raiz) {
      const atualizarLista = iniciarListaCadastros(raiz);

      return iniciarFormulario(raiz, { aoEnviar: atualizarLista });
    },
  },
};

const naoEncontrada = {
  titulo: "Página não encontrada | Projeto Raízes",
  template: naoEncontradaTemplate,
};

const saida = document.querySelector("#app");

criarRoteador({
  rotas,
  naoEncontrada,
  saida,

  aoNavegar({ rota, parametro, primeiraCarga }) {
    marcarLinkAtivo(rota);
    fecharMenus();
    posicionarConteudo(saida, parametro, primeiraCarga);
  },
});
