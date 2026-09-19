/*
   Datas com a biblioteca Day.js (https://day.js.org), carregada do CDN.

   A biblioteca entra como ES module por import() dinâmico: não cria
   variáveis globais e só é baixada quando a lista de cadastros precisa.
   Se o CDN estiver fora do ar, a aplicação continua com a data absoluta.
*/

const CDN = "https://cdn.jsdelivr.net/npm/dayjs@1.11.23";

let carregamento = null;

/* Carrega e configura o Day.js uma única vez. Resolve com null se falhar. */
function carregarDayjs() {
  carregamento ??= Promise.all([
    import(`${CDN}/+esm`),
    import(`${CDN}/plugin/relativeTime/+esm`),
    import(`${CDN}/locale/pt-br/+esm`),
  ])
    .then(([{ default: dayjs }, { default: relativeTime }]) => {
      dayjs.extend(relativeTime);
      dayjs.locale("pt-br");

      return dayjs;
    })
    .catch(() => null);

  return carregamento;
}

/* Data absoluta, sem depender da biblioteca: 19/09/2026, 17:08 */
export function formatarData(iso) {
  const data = new Date(iso);

  if (Number.isNaN(data.getTime())) return String(iso ?? "");

  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

/*
   Troca o texto dos <time data-relativo> por tempo relativo ("há 5 minutos").
   A data absoluta continua disponível no atributo title.
*/
export async function aplicarTempoRelativo(raiz) {
  const dayjs = await carregarDayjs();

  if (!dayjs) return;

  raiz.querySelectorAll("time[data-relativo]").forEach((elemento) => {
    const data = dayjs(elemento.dateTime);

    if (!data.isValid()) return;

    elemento.title = elemento.textContent.trim();
    elemento.textContent = data.fromNow();
  });
}
