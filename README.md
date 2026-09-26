# Faculdade — Desenvolvimento Front-end

Repositório dos trabalhos práticos do curso. Cada projeto fica numa pasta própria, com README,
código e testes.

| Projeto | Descrição | Pasta |
| ------- | --------- | ----- |
| Projeto Raízes | Site de uma organização fictícia de hortas comunitárias, em HTML, CSS e JavaScript puro (SPA) | [`desenvolvimento-web/projeto-raizes`](desenvolvimento-web/projeto-raizes) |

## Fluxo de trabalho (GitFlow)

Mesmo sendo um projeto individual, o repositório segue o fluxo de uma equipe:

| Branch | Papel | Sai de | Volta para |
| ------ | ----- | ------ | ---------- |
| `master` | Só versões lançadas. Cada merge recebe uma tag `vX.Y.Z` | — | — |
| `develop` | Integração: o código em desenvolvimento constante | `master` | — |
| `feature/<nome>` | Uma funcionalidade ou tarefa por branch | `develop` | `develop`, por pull request |
| `release/<versão>` | Ajustes finais antes de lançar | `develop` | `master` e `develop` |
| `hotfix/<nome>` | Correção urgente do que está em produção | `master` | `master` e `develop` |

```
master   ●───────────────────────────●  v1.0.0
          \                         /
develop    ●────●─────────●────────●──●
                 \       / \      /
feature/…         ●──●──●   ●──●─●
```

Passo a passo de uma mudança:

1. Abrir uma **issue** descrevendo o contexto e os critérios de aceite, dentro do **milestone** da versão.
2. Criar a branch a partir da `develop`: `git checkout -b feature/<nome> develop`.
3. Commitar no padrão abaixo e enviar a branch.
4. Abrir um **pull request** para a `develop` usando o template (resumo, `Closes #<issue>`, como testar, checklist).
5. Mesclar com merge commit (`--no-ff`), para o histórico mostrar o bloco de commits de cada funcionalidade.

## Padrão de commits

[Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/): `tipo(escopo): descrição no imperativo`.

| Tipo | Uso |
| ---- | --- |
| `feat` | Nova funcionalidade |
| `fix` | Correção de falha |
| `docs` | Só documentação |
| `refactor` | Mudança interna sem alterar comportamento |
| `style` | Formatação, sem mudança de lógica |
| `test` | Testes |
| `build` | Build, minificação, dependências |
| `chore` | Configuração e manutenção do repositório |

Exemplos do histórico: `feat(js): transforma o Projeto Raízes em SPA com JavaScript modular`,
`refactor(css): organiza o design system em tokens semânticos`.

## Versionamento

[Versionamento semântico](https://semver.org/lang/pt-BR/) `MAJOR.MINOR.PATCH`:

- **MAJOR** — mudança incompatível (ou a primeira versão estável, 1.0.0);
- **MINOR** — nova funcionalidade compatível;
- **PATCH** — correção ou melhoria interna sem mudar o comportamento.

Enquanto a versão é `0.x`, o projeto ainda está em evolução. Cada versão tem uma tag anotada e uma
[release no GitHub](https://github.com/felipepitol/faculdade/releases) com as notas de alteração.

| Versão | Conteúdo |
| ------ | -------- |
| v0.1.0 | Site estático: páginas inicial, projetos e cadastro, grid de 12 colunas, menu responsivo |
| v0.1.1 | Limpeza do CSS e design system em tokens semânticos |
| v0.2.0 | SPA com JavaScript modular, validação, `localStorage` e testes |
| v1.0.0 | *Em andamento* — acessibilidade WCAG 2.1 AA, build e deploy ([milestone](https://github.com/felipepitol/faculdade/milestone/1)) |
