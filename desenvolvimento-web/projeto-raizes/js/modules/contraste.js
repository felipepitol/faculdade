/*
   Modo alto contraste.
   O <html> recebe data-contraste="alto" e o CSS troca os tokens de cor.
   A escolha fica no localStorage; sem escolha, vale a preferência do
   sistema (prefers-contrast: more), já aplicada pelo script do <head>.
*/

import { CHAVES, salvar } from "./storage.js";
import { mostrarToast } from "./toast.js";

function aplicar(botao, ligado) {
  if (ligado) {
    document.documentElement.dataset.contraste = "alto";
  } else {
    delete document.documentElement.dataset.contraste;
  }

  botao.setAttribute("aria-pressed", String(ligado));
}

export function iniciarContraste() {
  const botao = document.querySelector(".contrast-toggle");

  if (!botao) return;

  aplicar(botao, document.documentElement.dataset.contraste === "alto");

  botao.addEventListener("click", () => {
    const ligado = botao.getAttribute("aria-pressed") !== "true";

    aplicar(botao, ligado);
    salvar(CHAVES.contraste, ligado ? "alto" : "padrao");

    mostrarToast({
      titulo: ligado ? "Alto contraste ativado" : "Alto contraste desativado",
      mensagem: "A preferência fica salva neste navegador.",
    });
  });
}
