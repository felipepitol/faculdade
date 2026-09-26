import { projetos } from "../data/projetos.js";
import { lista } from "../modules/html.js";

function cardProjeto(projeto) {
  return `
    <article class="card col-4" aria-labelledby="card-${projeto.id}">
      <img src="${projeto.imagem}" alt="${projeto.altCard}" width="800" height="500">

      <div class="card-content">
        ${projeto.badge ? `<span class="badge badge-active">${projeto.badge}</span>` : ""}

        <h3 id="card-${projeto.id}">${projeto.titulo}</h3>

        <p>${projeto.resumo}</p>

        <a href="#/projetos/${projeto.id}" class="button button-secondary">
          Conhecer projeto
          <span class="visually-hidden">${projeto.titulo}</span>
        </a>
      </div>
    </article>
  `;
}

export function homeTemplate() {
  return `
    <section class="hero">
      <div class="container grid hero-content">
        <div class="hero-text">
          <h1>Transformando comunidades através da sustentabilidade</h1>

          <p>
            O Projeto Raízes promove hortas comunitárias,
            educação ambiental e alimentação sustentável.
          </p>

          <a href="#/cadastro" class="button">Quero participar</a>
        </div>

        <div class="hero-image">
          <img
            src="../imagens/hero-horta-comunitaria.svg"
            alt="Voluntários trabalhando juntos em uma horta comunitária"
            width="800"
            height="500"
          >
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container grid">
        <div class="col-6">
          <div class="section-header">
            <h2>Quem somos</h2>

            <p>
              Somos uma organização dedicada à criação de espaços comunitários
              sustentáveis e à educação ambiental.
            </p>
          </div>

          <p>
            Nosso objetivo é transformar espaços urbanos em ambientes produtivos,
            aproximando pessoas e promovendo o cuidado com o meio ambiente.
          </p>
        </div>

        <div class="col-6">
          <div class="section-header">
            <h2>Nossa missão</h2>
          </div>

          <p>
            Promover sustentabilidade, educação ambiental e integração comunitária
            através do cultivo colaborativo de alimentos.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section-header">
          <h2>Nossos projetos</h2>

          <p>Conheça algumas das iniciativas desenvolvidas pelo Projeto Raízes.</p>
        </header>

        <div class="grid">
          ${lista(projetos, cardProjeto)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="highlight">
          <h2>Como ajudar</h2>

          <p>
            Você pode contribuir como voluntário, doador
            ou participando dos nossos mutirões.
          </p>

          <a href="#/cadastro" class="button">Participe do Projeto Raízes</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section-header">
          <h2>Entre em contato</h2>
        </header>

        <address class="contact-list">
          <p>
            E-mail:
            <a href="mailto:contato@projetoraizes.org">contato@projetoraizes.org</a>
          </p>

          <p>
            Telefone:
            <a href="tel:+5541999999999">(41) 99999-9999</a>
          </p>

          <p>Curitiba - PR</p>
        </address>
      </div>
    </section>
  `;
}
