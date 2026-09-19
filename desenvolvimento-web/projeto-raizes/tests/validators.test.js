import assert from "node:assert/strict";
import { test } from "node:test";

import { mascaras } from "../js/modules/masks.js";
import { lerHash } from "../js/modules/router.js";
import {
  cpfValido,
  validarCadastro,
  validarCampo,
} from "../js/modules/validators.js";

const cadastroValido = {
  nome: "Maria Silva",
  email: "maria@exemplo.com",
  nascimento: "1990-05-20",
  cpf: "529.982.247-25",
  telefone: "(41) 99999-9999",
  cep: "80000-000",
  estado: "PR",
  cidade: "Curitiba",
  endereco: "Rua das Flores, 100",
  participacao: "voluntario",
};

test("cpfValido confere os dígitos verificadores", () => {
  assert.equal(cpfValido("529.982.247-25"), true);
  assert.equal(cpfValido("52998224725"), true);
  assert.equal(cpfValido("529.982.247-26"), false);
  assert.equal(cpfValido("111.111.111-11"), false);
  assert.equal(cpfValido("123"), false);
});

test("cadastro completo não gera erros", () => {
  assert.deepEqual(validarCadastro(cadastroValido), {});
});

test("cadastro vazio aponta todos os campos obrigatórios", () => {
  assert.deepEqual(Object.keys(validarCadastro({})), [
    "nome",
    "email",
    "cpf",
    "telefone",
    "cep",
    "estado",
    "cidade",
    "endereco",
    "participacao",
  ]);
});

test("nome exige sobrenome", () => {
  assert.equal(validarCampo("nome", "Maria"), "Informe nome e sobrenome.");
  assert.equal(validarCampo("nome", "  Maria   Silva "), "");
});

test("e-mail precisa de domínio", () => {
  assert.notEqual(validarCampo("email", "maria@exemplo"), "");
  assert.notEqual(validarCampo("email", "maria exemplo.com"), "");
  assert.equal(validarCampo("email", "maria@exemplo.com.br"), "");
});

test("data de nascimento é opcional, mas não pode ser futura", () => {
  assert.equal(validarCampo("nascimento", ""), "");
  assert.notEqual(validarCampo("nascimento", "2999-01-01"), "");
  assert.notEqual(validarCampo("nascimento", "1800-01-01"), "");
});

test("telefone aceita fixo e celular com DDD", () => {
  assert.equal(validarCampo("telefone", "(41) 3333-4444"), "");
  assert.equal(validarCampo("telefone", "(41) 99999-9999"), "");
  assert.notEqual(validarCampo("telefone", "99999-9999"), "");
});

test("campo sem regra é sempre válido", () => {
  assert.equal(validarCampo("mensagem", ""), "");
});

test("máscaras formatam enquanto o usuário digita", () => {
  assert.equal(mascaras.cpf("52998224725"), "529.982.247-25");
  assert.equal(mascaras.cpf("5299"), "529.9");
  assert.equal(mascaras.cpf("529982247259999"), "529.982.247-25");
  assert.equal(mascaras.telefone("41999999999"), "(41) 99999-9999");
  assert.equal(mascaras.telefone("4133334444"), "(41) 3333-4444");
  assert.equal(mascaras.telefone("4"), "(4");
  assert.equal(mascaras.telefone("+55 (41) 99999-9999"), "(41) 99999-9999");
  assert.equal(mascaras.telefone("(55) 99999-9999"), "(55) 99999-9999");
  assert.equal(mascaras.cep("80000000"), "80000-000");
  assert.equal(mascaras.cep("abc800"), "800");
});

test("lerHash separa rota e parâmetro", () => {
  assert.deepEqual(lerHash(""), { rota: "", parametro: "" });
  assert.deepEqual(lerHash("#/"), { rota: "", parametro: "" });
  assert.deepEqual(lerHash("#/cadastro"), { rota: "cadastro", parametro: "" });
  assert.deepEqual(lerHash("#/projetos/horta-no-bairro"), {
    rota: "projetos",
    parametro: "horta-no-bairro",
  });
});
