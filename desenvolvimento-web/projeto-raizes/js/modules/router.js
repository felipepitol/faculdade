/*
   Roteador da SPA baseado no hash da URL.

   Formato: #/rota/parametro
   Ex.: #/projetos/horta-no-bairro → rota "projetos", parâmetro "horta-no-bairro"

   Cada rota é um objeto { titulo, template, iniciar? }:
   - template() devolve o HTML da view;
   - iniciar(raiz, parametro) liga os eventos da view e pode devolver
     uma função de limpeza, chamada quando o usuário sai da view.
*/

export function lerHash(hash) {
  const [rota = "", parametro = ""] = hash
    .replace(/^#\/?/, "")
    .split("/")
    .map(decodeURIComponent);

  return { rota, parametro };
}

export function criarRoteador({ rotas, naoEncontrada, saida, aoNavegar }) {
  let limpar = null;
  let rotaAtual = null;

  function navegar() {
    const { rota, parametro } = lerHash(location.hash);
    const view = rotas[rota] ?? naoEncontrada;
    const mudouDeView = rota !== rotaAtual;

    /* Links para âncoras da mesma view não precisam renderizar de novo */
    if (mudouDeView) {
      limpar?.();

      saida.innerHTML = view.template();
      limpar = view.iniciar?.(saida, parametro) ?? null;

      document.title = view.titulo;
    }

    aoNavegar?.({ rota, parametro, mudouDeView, primeiraCarga: rotaAtual === null });

    rotaAtual = rota;
  }

  window.addEventListener("hashchange", navegar);
  navegar();
}
