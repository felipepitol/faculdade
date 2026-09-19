import { projetos } from "../data/projetos.js";
import { lista } from "../modules/html.js";

function detalheProjeto({ titulo, itens, texto }) {
  const conteudo = itens
    ? `<ul>${lista(itens, (item) => `<li>${item}</li>`)}</ul>`
    : `<p>${texto}</p>`;

  return `<h3>${titulo}</h3>${conteudo}`;
}

function projetoCompleto(projeto) {
  return `
    <article class="project-card" id="${projeto.id}" tabindex="-1">
      <div class="grid">
        <div class="col-6">
          <img src="${projeto.imagem}" alt="${projeto.altDetalhe}" width="800" height="500">
        </div>

        <div class="col-6">
          <h2>${projeto.titulo}</h2>

          <p>${projeto.descricao}</p>

          ${detalheProjeto(projeto.detalhe)}
        </div>
      </div>
    </article>
  `;
}

export function projetosTemplate() {
  return `
    <section class="section">
      <div class="container">
        <header class="section-header">
          <h1>Nossos projetos</h1>

          <p>Conheça as iniciativas desenvolvidas pelo Projeto Raízes.</p>
        </header>

        ${lista(projetos, projetoCompleto)}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="highlight">
          <h2>Como contribuir</h2>

          <p>
            Você pode apoiar o Projeto Raízes participando como voluntário
            em nossas ações ou realizando uma contribuição para ajudar
            na manutenção dos projetos.
          </p>

          <a href="#/cadastro" class="button">Quero contribuir</a>
        </div>
      </div>
    </section>
  `;
}
