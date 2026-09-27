/*
   Gera as versões otimizadas das fotos a partir dos originais.

   Entrada: imagens/originais/*.png (fora do Git, ~2,7 MB cada)
   Saída:   imagens/<nome>-<largura>.<formato> (versionadas)

   - Recorte em 16:10, a proporção em que as fotos aparecem no site
   - Larguras 480, 800, 1200 e 1536 px (a maior é a do original:
     não há ampliação)
   - AVIF (menor), WebP (quase universal) e JPEG (reserva para
     navegadores antigos); o navegador escolhe via <picture>

   Uso: npm run imagens (só é preciso rodar quando uma foto mudar)
*/

import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { FORMATOS, LARGURAS, PROPORCAO } from "../js/data/imagens.js";

const PASTA = fileURLToPath(new URL("../imagens", import.meta.url));
const ORIGINAIS = join(PASTA, "originais");

const QUALIDADE = {
  avif: { quality: 50, effort: 6 },
  webp: { quality: 72, effort: 6 },
  jpg: { quality: 74, mozjpeg: true },
};

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`.padStart(8);

async function gerar(arquivo) {
  const nome = basename(arquivo, extname(arquivo));
  const original = join(ORIGINAIS, arquivo);
  const linhas = [`${nome} (original ${kb((await stat(original)).size).trim()})`];

  for (const largura of LARGURAS) {
    const altura = Math.round(largura / PROPORCAO);
    const base = sharp(original).resize(largura, altura, { fit: "cover", position: "centre" });
    const tamanhos = [];

    for (const formato of FORMATOS) {
      const destino = join(PASTA, `${nome}-${largura}.${formato}`);
      const saida = formato === "jpg" ? base.clone().jpeg(QUALIDADE.jpg) : base.clone()[formato](QUALIDADE[formato]);

      await saida.toFile(destino);
      tamanhos.push(`${formato} ${kb((await stat(destino)).size)}`);
    }

    linhas.push(`  ${String(largura).padStart(4)}×${altura}  ${tamanhos.join("  ")}`);
  }

  console.log(linhas.join("\n"));
}

async function main() {
  const originais = (await readdir(ORIGINAIS)).filter((n) => /\.(png|jpe?g)$/i.test(n));

  if (originais.length === 0) {
    throw new Error(`Nenhuma foto em ${ORIGINAIS}`);
  }

  /* Remove versões antigas geradas, para não sobrar arquivo órfão */
  for (const nome of await readdir(PASTA)) {
    if (/-\d+\.(avif|webp|jpg)$/.test(nome)) await unlink(join(PASTA, nome));
  }

  for (const arquivo of originais) await gerar(arquivo);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
