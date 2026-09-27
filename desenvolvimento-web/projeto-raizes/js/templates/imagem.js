import { FORMATOS, LARGURAS, PROPORCAO, TAMANHOS } from "../data/imagens.js";

const PASTA = "../imagens";

const TIPOS = { avif: "image/avif", webp: "image/webp" };

function srcset(nome, formato) {
  return LARGURAS.map((largura) => `${PASTA}/${nome}-${largura}.${formato} ${largura}w`).join(", ");
}

/*
   Foto responsiva com <picture>.
   O navegador escolhe o primeiro formato que suporta (AVIF, depois WebP)
   e, pelo sizes, a menor largura que ainda fica nítida na tela.

   - contexto: "hero", "card" ou "projeto" (ver TAMANHOS)
   - prioritaria: true só para a imagem principal visível ao abrir a
     página (o LCP); as outras carregam sob demanda
*/
export function imagemResponsiva({ nome, alt, contexto, prioritaria = false }) {
  const sizes = TAMANHOS[contexto];
  const [maior] = LARGURAS.slice(-1);
  const padrao = LARGURAS.find((l) => l >= 800) ?? maior;
  const altura = Math.round(maior / PROPORCAO);

  const fontes = FORMATOS.filter((f) => TIPOS[f])
    .map((f) => `<source type="${TIPOS[f]}" srcset="${srcset(nome, f)}" sizes="${sizes}">`)
    .join("");

  const carregamento = prioritaria
    ? 'fetchpriority="high"'
    : 'loading="lazy"';

  return `
    <picture>
      ${fontes}
      <img
        src="${PASTA}/${nome}-${padrao}.jpg"
        srcset="${srcset(nome, "jpg")}"
        sizes="${sizes}"
        alt="${alt}"
        width="${maior}"
        height="${altura}"
        ${carregamento}
        decoding="async"
      >
    </picture>
  `;
}
