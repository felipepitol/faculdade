# Projeto Raízes

**Site publicado:** <https://felipepitol.github.io/faculdade/>

Site de uma organização fictícia de hortas comunitárias, desenvolvido na disciplina de
Desenvolvimento Front-end. Apresenta a organização e seus projetos e recebe inscrições de
voluntários. É uma _Single Page Application_ em JavaScript puro, sem framework: a navegação
não recarrega a página e o conteúdo é gerado a partir de dados.

## Funcionalidades

- Três telas — início, projetos e cadastro — com roteamento por hash e página de "não encontrada"
- Layout responsivo com grid de 12 colunas e menu recolhível no celular
- Formulário de participação com máscaras (CPF, telefone, CEP), validação campo a campo e
  mensagens de erro acessíveis
- Rascunho salvo automaticamente e lista dos cadastros enviados, ambos no `localStorage`
- Tempo relativo nos cadastros ("há 5 minutos") com a biblioteca Day.js

## Tecnologias

| Tecnologia | Onde é usada |
| ---------- | ------------ |
| HTML5 semântico | `html/index.html`: casca da SPA com `header`, `nav`, `main` e `footer` |
| CSS3 (custom properties, Grid, Flexbox, media queries) | `css/`: design system em tokens, reset e componentes |
| JavaScript ES2022 com ES modules | `js/`: roteador, templates, validação e persistência, sem framework |
| Web Storage (`localStorage`) | `js/modules/storage.js` e `cadastros.js` |
| [Day.js](https://day.js.org) 1.11 via jsDelivr | `js/modules/datas.js`, carregado sob demanda |
| Node.js test runner (`node --test`) | `tests/`: testes das funções puras |
| Git + GitHub (GitFlow, Conventional Commits, SemVer) | Versionamento — ver o [README da raiz](../../README.md) |

## Pré-requisitos

| Ferramenta | Versão | Para quê |
| ---------- | ------ | -------- |
| Git | qualquer recente | Clonar o repositório |
| Node.js + npm | 18 ou superior | Rodar os scripts e os testes |
| Python 3 | 3.8 ou superior | Servidor local usado pelo `npm start` |
| Navegador | Chrome, Firefox, Safari ou Edge atuais | Usar o site |

Confira com `git --version`, `node --version` e `python3 --version`.

## Instalação e execução local

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   git clone https://github.com/felipepitol/faculdade.git
   cd faculdade/desenvolvimento-web/projeto-raizes
   ```

2. Instale as dependências de desenvolvimento (ferramentas de build: esbuild,
   html-minifier-terser e svgo). O site em si não tem dependências de runtime: o Day.js vem do CDN.

   ```bash
   npm install
   ```

3. Suba o servidor local:

   ```bash
   npm start            # python3 -m http.server 8080
   ```

   Módulos JavaScript (`type="module"`) não carregam direto de `file://`, por isso o servidor é
   obrigatório. A extensão Live Server do VS Code ou `npx serve` também funcionam.

4. Acesse <http://localhost:8080>. A raiz redireciona para `html/index.html`.

Para trabalhar numa mudança, crie a branch a partir da `develop` (`git checkout develop &&
git checkout -b feature/<nome>`), seguindo o fluxo descrito no README da raiz.

## Testes

```bash
npm test             # node --test
```

Cobrem as regras de validação, as máscaras e a leitura das rotas — tudo o que é função pura,
sem depender do navegador. Saída esperada:

```
ℹ tests 10
ℹ pass 10
ℹ fail 0
```

## Build de produção

```bash
npm install          # instala esbuild, html-minifier-terser e svgo
npm run build        # gera a pasta dist/
npm run preview      # build + servidor em http://localhost:8081 servindo dist/
```

O script [`scripts/build.mjs`](scripts/build.mjs) gera `dist/` com a mesma estrutura de pastas
(`html`, `css`, `js`, `imagens`), pronta para qualquer servidor estático:

| Etapa | Ferramenta | O que faz |
| ----- | ---------- | --------- |
| CSS | esbuild | Junta `tokens.css`, `reset.css` e `style.css` num arquivo e minifica |
| JS | esbuild | Empacota `main.js` e os módulos num bundle ES minificado; o Day.js continua vindo do CDN, sob demanda |
| Cache | esbuild | Nomes com hash do conteúdo (`app-PS5ARUD4.css`): o arquivo pode ficar em cache por muito tempo, e um deploy novo sempre gera outro nome |
| HTML | html-minifier-terser | Remove comentários e espaços e aponta os links para os arquivos gerados |
| Imagens | SVGO | Otimiza os SVGs (metadados, espaços, precisão numérica) |

Resultado do build na v1.0.2 (o `npm run build` imprime esta tabela atualizada a cada execução):

| Arquivo | Fonte | Minificado | Gzip |
| ------- | ----: | ---------: | ---: |
| CSS (3 arquivos → 1) | 28.6 KB | 17.3 KB | 3.7 KB |
| JS (18 módulos → 1) | 41.5 KB | 24.1 KB | 7.8 KB |
| HTML | 7.8 KB | 3.3 KB | 1.4 KB |
| Imagens SVG | 2.3 KB | 1.9 KB | 1.3 KB |
| **Total** | **80.2 KB** | **46.6 KB** | **14.3 KB** |

Além de reduzir 82% do peso transferido (com gzip), o bundle troca 21 requisições de CSS e JS por 2.

## Deploy

O site está publicado no GitHub Pages: **<https://felipepitol.github.io/faculdade/>**

A publicação é automática, pelo GitHub Actions:

| Workflow | Quando roda | O que faz |
| -------- | ----------- | --------- |
| [`ci.yml`](../../.github/workflows/ci.yml) | Todo pull request para `develop` ou `master` | `npm ci`, `npm test` e `npm run build`; o PR só é mesclado com tudo passando |
| [`deploy.yml`](../../.github/workflows/deploy.yml) | Todo push na `master` (release ou hotfix) | Testes, build e publicação da pasta `dist/` no GitHub Pages |

Seguindo o GitFlow, só o que passa por uma `release/*` ou `hotfix/*` chega à `master` e, portanto,
à produção. Para publicar de novo sem mudança de código, use "Run workflow" em Actions → Deploy.

## Acessibilidade

O projeto segue a WCAG 2.1 nível AA:

- **Semântica:** landmarks `header`, `nav` (com `aria-label`), `main` e `footer`; formulário com
  `label`, `fieldset`/`legend`, `required`, `aria-invalid` e `aria-describedby`
- **Teclado:** link "Pular para o conteúdo principal", submenu com `aria-expanded` que fecha com Esc,
  foco levado ao `<h1>` a cada troca de rota e contorno de foco em duas cores (anel + halo), visível
  em qualquer fundo
- **Contraste:** todo texto com pelo menos 4.5:1 (3:1 em texto grande) e bordas de campos e foco com
  pelo menos 3:1
- **Modo alto contraste:** botão "Alto contraste" no cabeçalho (`aria-pressed`), fundo preto, texto
  branco, ações em amarelo e links sempre sublinhados. A escolha fica no `localStorage`
  (`raizes:contraste`); sem escolha, segue a preferência do sistema (`prefers-contrast: more`).
  O modo de cores forçadas do Windows (`forced-colors`) também é respeitado
- **Movimento:** `prefers-reduced-motion` desliga transições e rolagem suave

## Estrutura

```
projeto-raizes/
├── index.html              redireciona para html/index.html
├── html/
│   └── index.html          casca única da SPA: cabeçalho, <main id="app">, rodapé
├── css/
│   ├── tokens.css          design system: cores, tipografia e espaçamentos
│   ├── reset.css           normalização dos estilos do navegador
│   └── style.css           layout, componentes e responsividade
├── imagens/                ilustrações em SVG usadas no hero e nos projetos
├── js/
│   ├── main.js             ponto de entrada: tabela de rotas e inicialização
│   ├── data/               conteúdo em forma de dados (projetos, opções do formulário)
│   ├── templates/          funções que devolvem o HTML de cada view
│   └── modules/            lógica, um arquivo por responsabilidade
│       ├── router.js       roteador por hash (#/rota/parametro)
│       ├── nav.js          link ativo, fechamento de menus, foco e rolagem
│       ├── form.js         eventos do formulário, feedback de erro, rascunho e envio
│       ├── validators.js   regras de validação (funções puras)
│       ├── masks.js        máscaras de CPF, telefone e CEP
│       ├── cadastros.js    gravação e listagem dos cadastros enviados
│       ├── storage.js      acesso ao localStorage com tratamento de falhas
│       ├── toast.js        aviso de feedback
│       ├── contraste.js    modo alto contraste (botão, preferência salva)
│       ├── datas.js        integração com o Day.js (tempo relativo)
│       └── html.js         escape de HTML e utilitário de listas
├── scripts/
│   └── build.mjs           build de produção (gera dist/, fora do Git)
└── tests/                  testes com o runner nativo do Node
```

## Biblioteca externa

[Day.js](https://day.js.org) 1.11.23, com o plugin `relativeTime` e o locale `pt-br`, mostra há quanto
tempo cada cadastro foi enviado ("há 5 minutos"). É carregada do jsDelivr como ES module por `import()`
dinâmico em `js/modules/datas.js`: não cria variáveis globais e só é baixada na tela de cadastro.
Se o CDN não responder, a lista continua exibindo a data absoluta.

## Rotas

| Hash                    | View                                          |
| ----------------------- | --------------------------------------------- |
| `#/`                    | Início                                        |
| `#/projetos`            | Projetos                                      |
| `#/projetos/<id>`       | Projetos, rolando até o projeto indicado      |
| `#/cadastro`            | Formulário de participação                    |
| qualquer outro          | Página não encontrada                         |

## Dados no localStorage

| Chave              | Conteúdo                                                                  |
| ------------------ | ------------------------------------------------------------------------- |
| `raizes:rascunho`  | Campos preenchidos e ainda não enviados. O CPF fica de fora.              |
| `raizes:cadastros` | Cadastros enviados. Do CPF só são guardados os três dígitos centrais.     |
| `raizes:contraste` | Preferência de contraste: `"alto"` ou `"padrao"`.                         |

## Versões e contribuição

O histórico de versões, o fluxo de branches (GitFlow) e o padrão de commits estão no
[README da raiz do repositório](../../README.md). Em resumo: toda mudança nasce numa issue,
é feita numa branch `feature/*` a partir da `develop` e entra por pull request.
