import { estados, participacoes, LIMITE_MENSAGEM } from "../data/formulario.js";
import { formatarData } from "../modules/datas.js";
import { escapeHtml, lista } from "../modules/html.js";

/*
   Campo de formulário com rótulo e espaço reservado para a mensagem de erro.
   "atributos" recebe os atributos extras do controle (type, placeholder etc.).
*/
function campo({ id, rotulo, atributos = "", classe = "", opcional = false }) {
  return `
    <div class="form-group ${classe}">
      <label for="${id}">
        ${rotulo}
        ${opcional ? '<span class="label-optional">(opcional)</span>' : ""}
      </label>

      <input id="${id}" name="${id}" aria-describedby="erro-${id}" ${opcional ? "" : "required"} ${atributos}>

      <p class="field-error" id="erro-${id}" hidden></p>
    </div>
  `;
}

function opcaoParticipacao([valor, rotulo]) {
  return `
    <div class="radio-option">
      <input type="radio" id="${valor}" name="participacao" value="${valor}" required>
      <label for="${valor}">${rotulo}</label>
    </div>
  `;
}

export function cadastroTemplate() {
  return `
    <section class="section">
      <div class="container form-container">
        <header class="section-header">
          <h1>Faça parte do Projeto Raízes</h1>

          <p>
            Preencha seus dados para participar como voluntário
            ou apoiar nossos projetos.
          </p>
        </header>

        <div class="alert alert-info" role="status">
          <strong>Antes de enviar:</strong>
          confira se seus dados de contato estão corretos.
        </div>

        <div class="alert alert-info draft-notice" id="aviso-rascunho" role="status" hidden>
          <span>Recuperamos o rascunho que você tinha começado a preencher.</span>

          <button type="button" class="link-button" id="descartar-rascunho">
            Descartar rascunho
          </button>
        </div>

        <div class="alert alert-error" id="resumo-erros" role="alert" hidden>
          <strong id="resumo-erros-titulo"></strong>

          <ul class="error-summary-list" aria-labelledby="resumo-erros-titulo"></ul>
        </div>

        <form id="form-cadastro" action="#" method="post" novalidate aria-describedby="instrucoes-form">
          <p class="field-hint" id="instrucoes-form">
            Todos os campos são obrigatórios, exceto os marcados como opcionais.
          </p>

          <fieldset>
            <legend>Dados pessoais</legend>

            <div class="form-grid">
              ${campo({
                id: "nome",
                rotulo: "Nome completo",
                classe: "form-group-full",
                atributos: 'type="text" placeholder="Seu nome completo" maxlength="100" autocomplete="name"',
              })}

              ${campo({
                id: "email",
                rotulo: "E-mail",
                atributos: 'type="email" placeholder="nome@exemplo.com" maxlength="100" autocomplete="email"',
              })}

              ${campo({
                id: "nascimento",
                rotulo: "Data de nascimento",
                opcional: true,
                atributos: 'type="date" autocomplete="bday"',
              })}

              ${campo({
                id: "cpf",
                rotulo: "CPF",
                atributos: 'type="text" placeholder="000.000.000-00" maxlength="14" inputmode="numeric" data-mascara="cpf"',
              })}

              ${campo({
                id: "telefone",
                rotulo: "Telefone",
                atributos: 'type="tel" placeholder="(00) 00000-0000" maxlength="15" inputmode="numeric" autocomplete="tel-national" data-mascara="telefone"',
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend>Endereço</legend>

            <div class="form-grid">
              ${campo({
                id: "cep",
                rotulo: "CEP",
                atributos: 'type="text" placeholder="00000-000" maxlength="9" inputmode="numeric" autocomplete="postal-code" data-mascara="cep"',
              })}

              <div class="form-group">
                <label for="estado">Estado</label>

                <select id="estado" name="estado" aria-describedby="erro-estado" autocomplete="address-level1" required>
                  <option value="">Selecione</option>
                  ${lista(estados, ([uf, nome]) => `<option value="${uf}">${nome}</option>`)}
                </select>

                <p class="field-error" id="erro-estado" hidden></p>
              </div>

              ${campo({
                id: "cidade",
                rotulo: "Cidade",
                atributos: 'type="text" placeholder="Sua cidade" maxlength="100" autocomplete="address-level2"',
              })}

              ${campo({
                id: "endereco",
                rotulo: "Endereço",
                atributos: 'type="text" placeholder="Rua, número e bairro" maxlength="150" autocomplete="street-address"',
              })}
            </div>
          </fieldset>

          <fieldset aria-describedby="erro-participacao">
            <legend>Como deseja participar?</legend>

            <div class="radio-group">
              ${lista(participacoes, opcaoParticipacao)}
            </div>

            <p class="field-error" id="erro-participacao" hidden></p>
          </fieldset>

          <fieldset>
            <legend>Informações adicionais</legend>

            <div class="form-group">
              <label for="mensagem">
                Conte um pouco sobre como gostaria de ajudar
                <span class="label-optional">(opcional)</span>
              </label>

              <textarea
                id="mensagem"
                name="mensagem"
                rows="5"
                maxlength="${LIMITE_MENSAGEM}"
                placeholder="Escreva sua mensagem"
                aria-describedby="contador-mensagem"
              ></textarea>

              <p class="field-hint" id="contador-mensagem">0 de ${LIMITE_MENSAGEM} caracteres</p>
            </div>
          </fieldset>

          <div>
            <button type="submit" class="button">Enviar cadastro</button>
          </div>
        </form>

        <section class="saved-section" aria-labelledby="titulo-cadastros">
          <h2 id="titulo-cadastros" tabindex="-1">Cadastros salvos neste navegador</h2>

          <div id="lista-cadastros"></div>
        </section>
      </div>
    </section>
  `;
}

/* Lista de cadastros guardados no localStorage */
export function listaCadastrosTemplate(cadastros, rotulos) {
  if (cadastros.length === 0) {
    return `<p class="field-hint">Nenhum cadastro enviado ainda.</p>`;
  }

  return `
    <ul class="saved-list">
      ${lista(
        cadastros,
        (cadastro) => `
          <li class="saved-item">
            <div>
              <strong>${escapeHtml(cadastro.nome)}</strong>

              <span class="badge badge-success">
                ${escapeHtml(rotulos[cadastro.participacao] ?? cadastro.participacao)}
              </span>

              <p class="field-hint">
                ${escapeHtml(cadastro.email)} ·
                ${escapeHtml(cadastro.cidade)}/${escapeHtml(cadastro.estado)} ·
                enviado
                <time datetime="${escapeHtml(cadastro.enviadoEm)}" data-relativo>
                  em ${escapeHtml(formatarData(cadastro.enviadoEm))}
                </time>
              </p>
            </div>

            <button
              type="button"
              class="link-button"
              data-remover="${escapeHtml(cadastro.id)}"
              aria-label="Remover cadastro de ${escapeHtml(cadastro.nome)}"
            >
              Remover
            </button>
          </li>
        `,
      )}
    </ul>
  `;
}
