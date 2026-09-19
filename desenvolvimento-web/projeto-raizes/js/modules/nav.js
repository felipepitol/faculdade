/*
   Comportamento do cabeçalho: link ativo, menus e foco após a navegação.
*/

import { lerHash } from "./router.js";

/* Marca com aria-current os links que apontam para a rota atual */
export function marcarLinkAtivo(rotaAtual) {
  document.querySelectorAll(".site-header nav a").forEach((link) => {
    const { rota, parametro } = lerHash(link.getAttribute("href"));
    const ativo = rota === rotaAtual && !parametro;

    if (ativo) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* Fecha o menu mobile e o submenu depois de escolher um link */
export function fecharMenus() {
  document
    .querySelectorAll(".mobile-nav, .mobile-submenu")
    .forEach((menu) => menu.removeAttribute("open"));

  /* Tira o foco do dropdown desktop, que abre com :focus-within */
  if (document.activeElement?.closest(".has-submenu")) {
    document.activeElement.blur();
  }
}

/*
   Leva a rolagem e o foco para o conteúdo novo.
   Com parâmetro, vai até a seção correspondente (ex.: um projeto).
*/
export function posicionarConteudo(saida, parametro, primeiraCarga) {
  const alvo = parametro && document.getElementById(parametro);

  if (alvo) {
    alvo.scrollIntoView();
    alvo.focus({ preventScroll: true });

    return;
  }

  window.scrollTo(0, 0);

  if (!primeiraCarga) saida.focus({ preventScroll: true });
}
