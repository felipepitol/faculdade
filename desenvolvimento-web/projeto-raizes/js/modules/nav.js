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

/*
   Submenu de Projetos no desktop (padrão de divulgação da WAI-ARIA).
   O botão informa o estado com aria-expanded; o mouse continua abrindo
   por hover, mas Esc fecha nos dois casos (WCAG 1.4.13).
*/
function abrirSubmenu(botao, aberto) {
  botao.setAttribute("aria-expanded", String(aberto));
  botao.setAttribute(
    "aria-label",
    aberto ? "Ocultar lista de projetos" : "Mostrar lista de projetos",
  );
}

export function iniciarSubmenu() {
  const item = document.querySelector(".has-submenu");
  const botao = item?.querySelector(".submenu-toggle");

  if (!botao) return;

  botao.addEventListener("click", () => {
    abrirSubmenu(botao, botao.getAttribute("aria-expanded") !== "true");
  });

  item.addEventListener("keydown", (evento) => {
    if (evento.key !== "Escape") return;

    abrirSubmenu(botao, false);
    item.classList.add("is-dismissed");
    botao.focus();
  });

  /* Fecha quando o foco sai do item (Tab para o próximo link) */
  item.addEventListener("focusout", (evento) => {
    if (!item.contains(evento.relatedTarget)) abrirSubmenu(botao, false);
  });

  /* Depois de fechado com Esc, o hover só volta a abrir numa nova passagem do mouse */
  item.addEventListener("mouseleave", () => item.classList.remove("is-dismissed"));
}

/* O link de pular conteúdo não pode mudar o hash, que é usado pelo roteador */
export function iniciarSkipLink(saida) {
  document.querySelector(".skip-link")?.addEventListener("click", (evento) => {
    evento.preventDefault();
    focarTitulo(saida);
  });
}

/* Fecha o menu mobile e o submenu depois de escolher um link */
export function fecharMenus() {
  document
    .querySelectorAll(".mobile-nav, .mobile-submenu")
    .forEach((menu) => menu.removeAttribute("open"));

  const botao = document.querySelector(".submenu-toggle");

  if (botao) abrirSubmenu(botao, false);
}

/*
   Leva o foco para o título da view. O leitor de tela anuncia o <h1>,
   então a pessoa sabe em que página chegou.
*/
function focarTitulo(saida) {
  const titulo = saida.querySelector("h1") ?? saida;

  titulo.setAttribute("tabindex", "-1");
  titulo.focus({ preventScroll: true });
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

  if (!primeiraCarga) focarTitulo(saida);
}
