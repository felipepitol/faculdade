/*
   Toast de feedback.
   A região #toast-region fica na casca da página com aria-live,
   então a mensagem também é anunciada por leitores de tela.
*/

const DURACAO = 6000;

export function mostrarToast({ titulo, mensagem, tipo = "success" }) {
  const regiao = document.querySelector("#toast-region");

  if (!regiao) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;

  const forte = document.createElement("strong");
  forte.textContent = titulo;

  const texto = document.createElement("span");
  texto.textContent = mensagem;

  const fechar = document.createElement("button");
  fechar.type = "button";
  fechar.className = "toast-close";
  fechar.setAttribute("aria-label", "Fechar aviso");
  fechar.textContent = "×";

  toast.append(forte, texto, fechar);

  const remover = () => toast.remove();
  const temporizador = setTimeout(remover, DURACAO);

  fechar.addEventListener("click", () => {
    clearTimeout(temporizador);
    remover();
  });

  regiao.replaceChildren(toast);
}
