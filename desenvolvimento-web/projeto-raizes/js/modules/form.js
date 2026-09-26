/*
   Controle do formulário de cadastro:
   eventos, máscaras, validação com feedback, rascunho e envio.
*/

import { LIMITE_MENSAGEM } from "../data/formulario.js";
import { aplicarMascara } from "./masks.js";
import { CHAVES, ler, remover, salvar } from "./storage.js";
import { mostrarToast } from "./toast.js";
import { camposValidados, validarCadastro, validarCampo } from "./validators.js";
import { adicionarCadastro } from "./cadastros.js";

const ESPERA_RASCUNHO = 400;

function lerDados(form) {
  return Object.fromEntries(new FormData(form));
}

/* O rascunho não guarda o CPF: dado sensível só fica na tela */
function dadosDoRascunho(form) {
  const { cpf, ...rascunho } = lerDados(form);

  return rascunho;
}

/* Controles de um campo: um input/select ou o grupo de radios */
function controlesDoCampo(form, nome) {
  const controle = form.elements[nome];

  if (!controle) return [];

  return controle instanceof RadioNodeList ? [...controle] : [controle];
}

function mostrarErro(form, nome, mensagem) {
  const erro = form.querySelector(`#erro-${nome}`);

  if (!erro) return;

  erro.textContent = mensagem;
  erro.hidden = !mensagem;

  controlesDoCampo(form, nome).forEach((controle) => {
    controle.setAttribute("aria-invalid", String(Boolean(mensagem)));
    controle.classList.toggle("is-valid", !mensagem && controle.value !== "");
  });
}

function validarEExibir(form, nome) {
  const mensagem = validarCampo(nome, lerDados(form)[nome]);

  mostrarErro(form, nome, mensagem);

  return mensagem;
}

function atualizarContador(form) {
  const contador = form.querySelector("#contador-mensagem");
  const usados = form.elements.mensagem.value.length;

  contador.textContent = `${usados} de ${LIMITE_MENSAGEM} caracteres`;
}

/* Nome do campo como a pessoa vê na tela: o <label> ou a <legend> do grupo */
function rotuloDoCampo(form, nome) {
  const [controle] = controlesDoCampo(form, nome);
  const rotulo =
    controle?.type === "radio"
      ? controle.closest("fieldset")?.querySelector("legend")
      : form.querySelector(`label[for="${nome}"]`);

  return rotulo?.firstChild?.textContent.trim() ?? nome;
}

/*
   Resumo de erros no topo: diz quantos e quais campos corrigir.
   Cada item é um botão que leva o foco ao campo (os links com #id
   mudariam o hash, que é usado pelo roteador).
*/
function mostrarResumo(raiz, erros) {
  const resumo = raiz.querySelector("#resumo-erros");
  const form = raiz.querySelector("#form-cadastro");
  const nomes = Object.keys(erros);

  resumo.hidden = nomes.length === 0;

  if (nomes.length === 0) return;

  resumo.querySelector("#resumo-erros-titulo").textContent =
    nomes.length === 1
      ? "Há 1 campo para corrigir antes de enviar:"
      : `Há ${nomes.length} campos para corrigir antes de enviar:`;

  const itens = nomes.map((nome) => {
    const item = document.createElement("li");
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "link-button";
    botao.dataset.focar = nome;
    botao.textContent = `${rotuloDoCampo(form, nome)} — ${erros[nome]}`;

    item.append(botao);

    return item;
  });

  resumo.querySelector(".error-summary-list").replaceChildren(...itens);
}

function restaurarRascunho(raiz, form) {
  const rascunho = ler(CHAVES.rascunho);

  /* Ignora conteúdo que não seja um objeto de campos preenchidos */
  if (!rascunho || typeof rascunho !== "object" || Array.isArray(rascunho)) return;

  const preenchidos = Object.entries(rascunho).filter(
    ([nome, valor]) =>
      typeof valor === "string" && valor.trim() !== "" && form.elements[nome],
  );

  if (preenchidos.length === 0) return;

  for (const [nome, valor] of preenchidos) {
    form.elements[nome].value = valor;
  }

  raiz.querySelector("#aviso-rascunho").hidden = false;
}

function limparFormulario(raiz, form) {
  form.reset();
  remover(CHAVES.rascunho);

  form
    .querySelectorAll("[aria-invalid], .is-valid")
    .forEach((controle) => {
      controle.removeAttribute("aria-invalid");
      controle.classList.remove("is-valid");
    });

  form.querySelectorAll(".field-error").forEach((erro) => (erro.hidden = true));

  raiz.querySelector("#aviso-rascunho").hidden = true;
  mostrarResumo(raiz, {});
  atualizarContador(form);
}

export function iniciarFormulario(raiz, { aoEnviar } = {}) {
  const form = raiz.querySelector("#form-cadastro");
  let temporizador = null;

  restaurarRascunho(raiz, form);
  atualizarContador(form);

  const cancelarRascunhoPendente = () => {
    clearTimeout(temporizador);
    temporizador = null;
  };

  /* Espera uma pausa na digitação para não gravar a cada tecla */
  const salvarRascunho = () => {
    clearTimeout(temporizador);

    temporizador = setTimeout(() => {
      temporizador = null;
      salvar(CHAVES.rascunho, dadosDoRascunho(form));
    }, ESPERA_RASCUNHO);
  };

  /* Digitação: máscara, contador, rascunho e correção de erro já exibido */
  form.addEventListener("input", ({ target }) => {
    aplicarMascara(target);

    if (target.name === "mensagem") atualizarContador(form);

    if (target.getAttribute("aria-invalid") === "true") {
      validarEExibir(form, target.name);
    }

    salvarRascunho();
  });

  /* Radios e select confirmam o valor no change */
  form.addEventListener("change", ({ target }) => {
    if (target.matches("select, [type=radio]")) validarEExibir(form, target.name);
  });

  /* Saída do campo: valida o que foi digitado */
  form.addEventListener("focusout", ({ target }) => {
    if (target.matches("input:not([type=radio])")) {
      validarEExibir(form, target.name);
    }
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = lerDados(form);
    const erros = validarCadastro(dados);

    camposValidados.forEach((nome) => mostrarErro(form, nome, erros[nome] ?? ""));

    mostrarResumo(raiz, erros);

    const primeiroComErro = Object.keys(erros)[0];

    if (primeiroComErro) {
      controlesDoCampo(form, primeiroComErro)[0].focus();

      return;
    }

    const salvo = adicionarCadastro(dados);

    cancelarRascunhoPendente();
    limparFormulario(raiz, form);
    aoEnviar?.();

    mostrarToast(
      salvo
        ? {
            titulo: "Cadastro enviado!",
            mensagem: "Recebemos seus dados com sucesso.",
          }
        : {
            titulo: "Cadastro enviado, mas não salvo",
            mensagem: "Seu navegador bloqueou o armazenamento local.",
            tipo: "error",
          },
    );
  });

  raiz.querySelector("#resumo-erros").addEventListener("click", ({ target }) => {
    const nome = target.closest("[data-focar]")?.dataset.focar;

    if (nome) controlesDoCampo(form, nome)[0]?.focus();
  });

  raiz.querySelector("#descartar-rascunho").addEventListener("click", () => {
    cancelarRascunhoPendente();
    limparFormulario(raiz, form);
    form.elements.nome.focus();
  });

  /* Limpeza ao sair da view: grava o rascunho pendente na hora */
  return () => {
    if (temporizador === null) return;

    cancelarRascunhoPendente();
    salvar(CHAVES.rascunho, dadosDoRascunho(form));
  };
}
