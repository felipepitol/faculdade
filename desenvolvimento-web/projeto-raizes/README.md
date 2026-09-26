# Projeto Raízes

Site de uma organização fictícia de hortas comunitárias, desenvolvido na disciplina de
Desenvolvimento Front-end. Nesta etapa a interface estática virou uma _Single Page Application_
em JavaScript puro: navegação sem recarregar a página, templates, validação de formulário
com feedback e dados guardados no `localStorage`.

## Requisitos

- Navegador atual (Chrome, Firefox, Safari ou Edge)
- Python 3 ou qualquer servidor estático, para rodar localmente
- Node.js 18 ou superior, só para os testes

## Como rodar

Módulos JavaScript (`type="module"`) não carregam direto de `file://`, então o projeto
precisa de um servidor local. Qualquer um serve:

```bash
npm start            # python3 -m http.server 8080
```

Depois acesse <http://localhost:8080>. A extensão Live Server do VS Code também funciona.

## Testes

```bash
npm test             # node --test
```

Cobrem as regras de validação, as máscaras e a leitura das rotas — tudo o que é função pura,
sem depender do navegador.

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
│       ├── datas.js        integração com o Day.js (tempo relativo)
│       └── html.js         escape de HTML e utilitário de listas
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

## Versões e contribuição

O histórico de versões, o fluxo de branches (GitFlow) e o padrão de commits estão no
[README da raiz do repositório](../../README.md). Em resumo: toda mudança nasce numa issue,
é feita numa branch `feature/*` a partir da `develop` e entra por pull request.
