# Changelog

Todas as mudanças relevantes do repositório. O formato segue o
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o
[versionamento semântico](https://semver.org/lang/pt-BR/).

## [1.0.2] — 2026-09-26

### Documentação
- Números do build no README atualizados após o hotfix v1.0.1 (CSS 28.6 KB → 17.3 KB; total 80.2 KB → 46.6 KB, 14.3 KB com gzip) ([#16](https://github.com/felipepitol/faculdade/pull/16))

## [1.0.1] — 2026-09-26

### Corrigido
- Link da página atual no menu indicado também por sublinhado, não só pela cor (WCAG 1.4.1)

## [1.0.0] — 2026-09-26

Primeira versão estável do Projeto Raízes, publicada em <https://felipepitol.github.io/faculdade/>.

### Adicionado
- Templates de issue e pull request ([#5](https://github.com/felipepitol/faculdade/pull/5))
- README na raiz com GitFlow, Conventional Commits e versionamento ([#6](https://github.com/felipepitol/faculdade/pull/6))
- README do projeto com visão geral, tecnologias e instalação local ([#8](https://github.com/felipepitol/faculdade/pull/8))
- Acessibilidade WCAG 2.1 AA: link de pular conteúdo, submenu com `aria-expanded`, foco no título a cada rota,
  resumo de erros com links para os campos, campos obrigatórios expostos ([#10](https://github.com/felipepitol/faculdade/pull/10))
- Modo alto contraste com preferência salva e suporte a `prefers-contrast` e `forced-colors` ([#11](https://github.com/felipepitol/faculdade/pull/11))
- Build de produção (esbuild, html-minifier-terser, SVGO), CI nos pull requests e deploy no GitHub Pages ([#12](https://github.com/felipepitol/faculdade/pull/12))

### Corrigido
- Contraste da borda dos campos (2.0:1 → 3.6:1) e do contorno de foco (2.2:1 → 11:1) ([#11](https://github.com/felipepitol/faculdade/pull/11))

## [0.2.0] — 2026-09-19

### Adicionado
- SPA com roteador por hash, templates, validação com feedback, `localStorage`, Day.js e testes

## [0.1.1] — 2026-09-19

### Alterado
- CSS limpo e design system reorganizado em tokens semânticos

## [0.1.0] — 2026-09-19

### Adicionado
- Site estático: páginas inicial, projetos e cadastro, grid de 12 colunas e menu responsivo

[1.0.2]: https://github.com/felipepitol/faculdade/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/felipepitol/faculdade/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/felipepitol/faculdade/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/felipepitol/faculdade/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/felipepitol/faculdade/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/felipepitol/faculdade/releases/tag/v0.1.0
