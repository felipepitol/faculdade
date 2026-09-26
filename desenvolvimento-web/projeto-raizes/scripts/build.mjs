/*
   Build de produção do Projeto Raízes.

   Gera a pasta dist/ com a mesma estrutura do código-fonte
   (html, css, js, imagens), pronta para qualquer servidor estático:

   - CSS: os três arquivos viram um só, minificado (esbuild)
   - JS: os módulos viram um bundle ES minificado (esbuild); o Day.js
     continua vindo do CDN, sob demanda
   - Nomes com hash do conteúdo (app-3f2a1c.css), para cache longo sem
     servir versão velha depois de um deploy
   - HTML minificado, com os links apontando para os arquivos gerados
   - SVGs otimizados com SVGO

   Uso: npm run build
*/

import { build } from "esbuild";
import { minify } from "html-minifier-terser";
import { optimize } from "svgo";
import { gzipSync } from "node:zlib";
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(RAIZ, "dist");

const linhas = [];

async function tamanho(caminho) {
  return (await stat(caminho)).size;
}

async function tamanhoPasta(pasta, filtro = () => true) {
  let total = 0;

  for (const nome of await readdir(pasta)) {
    if (filtro(nome)) total += await tamanho(join(pasta, nome));
  }

  return total;
}

function registrar(rotulo, antes, depois, gzip) {
  linhas.push({ rotulo, antes, depois, gzip });
}

/* Bundle de CSS ou JS com hash no nome; devolve o nome gerado */
async function empacotar({ entrada, conteudo, pasta, nome }) {
  const resultado = await build({
    ...(conteudo
      ? { stdin: { contents: conteudo, resolveDir: RAIZ, loader: "css" } }
      : { entryPoints: [entrada] }),
    bundle: true,
    minify: true,
    format: "esm",
    target: ["es2022", "chrome100", "firefox100", "safari15"],
    /* URLs absolutas (Day.js no CDN) ficam de fora do bundle */
    external: ["https://*"],
    entryNames: `${nome}-[hash]`,
    outdir: join(DIST, pasta),
    metafile: true,
    logLevel: "warning",
  });

  const [saida] = Object.keys(resultado.metafile.outputs);

  return basename(saida);
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  /* CSS: tokens + reset + estilos, na ordem da página */
  const arquivosCss = ["tokens.css", "reset.css", "style.css"];
  const css = await empacotar({
    conteudo: arquivosCss.map((a) => `@import "./css/${a}";`).join("\n"),
    pasta: "css",
    nome: "app",
  });

  registrar(
    `CSS (${arquivosCss.length} arquivos → 1)`,
    await tamanhoPasta(join(RAIZ, "css")),
    await tamanho(join(DIST, "css", css)),
    gzipSync(await readFile(join(DIST, "css", css))).length,
  );

  /* JS: main.js e todos os módulos importados */
  const js = await empacotar({
    entrada: join(RAIZ, "js", "main.js"),
    pasta: "js",
    nome: "app",
  });

  let jsAntes = 0;
  let modulos = 0;

  for (const pasta of ["", "data", "modules", "templates"]) {
    const dir = join(RAIZ, "js", pasta);

    jsAntes += await tamanhoPasta(dir, (n) => n.endsWith(".js"));
    modulos += (await readdir(dir)).filter((n) => n.endsWith(".js")).length;
  }

  registrar(
    `JS (${modulos} módulos → 1)`,
    jsAntes,
    await tamanho(join(DIST, "js", js)),
    gzipSync(await readFile(join(DIST, "js", js))).length,
  );

  /* HTML: troca os links pelos arquivos gerados e minifica */
  const fonte = await readFile(join(RAIZ, "html", "index.html"), "utf8");

  const html = fonte
    .replace(
      /(\s*<link rel="stylesheet" href="\.\.\/css\/[^"]+">)+/,
      `\n    <link rel="stylesheet" href="../css/${css}">`,
    )
    .replace(
      '<script type="module" src="../js/main.js"></script>',
      `<script type="module" src="../js/${js}"></script>`,
    );

  if (html.includes("../css/tokens.css") || html.includes("../js/main.js")) {
    throw new Error("html/index.html mudou: atualize as trocas de link em scripts/build.mjs");
  }

  const htmlMin = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    minifyJS: true,
    minifyCSS: true,
  });

  await mkdir(join(DIST, "html"), { recursive: true });
  await writeFile(join(DIST, "html", "index.html"), htmlMin);
  await cp(join(RAIZ, "index.html"), join(DIST, "index.html"));

  registrar(
    "HTML",
    Buffer.byteLength(fonte),
    Buffer.byteLength(htmlMin),
    gzipSync(htmlMin).length,
  );

  /* Imagens: SVGO remove metadados, espaços e casas decimais sobrando */
  await mkdir(join(DIST, "imagens"), { recursive: true });

  let imgAntes = 0;
  let imgDepois = 0;
  let imgGzip = 0;

  for (const nome of await readdir(join(RAIZ, "imagens"))) {
    const original = await readFile(join(RAIZ, "imagens", nome), "utf8");
    const { data } = optimize(original, { multipass: true });

    await writeFile(join(DIST, "imagens", nome), data);

    imgAntes += Buffer.byteLength(original);
    imgDepois += Buffer.byteLength(data);
    imgGzip += gzipSync(data).length;
  }

  registrar("Imagens SVG", imgAntes, imgDepois, imgGzip);

  /* Relatório */
  const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
  let [totalAntes, totalDepois, totalGzip] = [0, 0, 0];

  console.log(`\nBuild gerado em ${relative(process.cwd(), DIST) || "dist"}/\n`);
  console.log("Arquivo".padEnd(24), "Fonte".padStart(10), "Minificado".padStart(12), "Gzip".padStart(10));

  for (const { rotulo, antes, depois, gzip } of linhas) {
    console.log(rotulo.padEnd(24), kb(antes).padStart(10), kb(depois).padStart(12), kb(gzip).padStart(10));
    totalAntes += antes;
    totalDepois += depois;
    totalGzip += gzip;
  }

  console.log(
    "Total".padEnd(24),
    kb(totalAntes).padStart(10),
    kb(totalDepois).padStart(12),
    kb(totalGzip).padStart(10),
  );
  console.log(
    `\nRedução: ${(100 - (totalDepois / totalAntes) * 100).toFixed(0)}% minificado,`,
    `${(100 - (totalGzip / totalAntes) * 100).toFixed(0)}% com gzip.\n`,
  );
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
