/*
   Utilitários para montar HTML em template strings.
*/

const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/* Escapa texto vindo do usuário antes de inserir via innerHTML */
export function escapeHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/* Junta uma lista de itens aplicando um template a cada um */
export function lista(itens, template) {
  return itens.map(template).join("");
}
