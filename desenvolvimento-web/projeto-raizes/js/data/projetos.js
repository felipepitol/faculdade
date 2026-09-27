/*
   Dados dos projetos.
   Os templates da home e da página de projetos são gerados a partir desta lista.
   "imagem" é o nome base das fotos em imagens/ (ver js/data/imagens.js).
*/

export const projetos = [
  {
    id: "horta-no-bairro",
    titulo: "Horta no Bairro",
    imagem: "horta-no-bairro",
    altCard: "Canteiros de alface e cebolinha em horta comunitária, com um muro grafitado ao fundo",
    altDetalhe: "Um senhor de boné e uma jovem arrancam ervas daninhas de um canteiro de alfaces; ao fundo, outros moradores regam a horta diante de um muro grafitado",
    badge: "Projeto ativo",
    resumo:
      "Transformamos terrenos disponíveis em hortas comunitárias mantidas pelos próprios moradores.",
    descricao:
      "O projeto cria hortas comunitárias em terrenos disponíveis dentro das comunidades.",
    detalhe: {
      titulo: "Objetivos",
      itens: [
        "Estimular a produção local de alimentos.",
        "Fortalecer a comunidade.",
        "Promover uma alimentação saudável.",
      ],
    },
  },
  {
    id: "raizes-na-escola",
    titulo: "Raízes na Escola",
    imagem: "raizes-na-escola",
    altCard: "Crianças de uniforme escolar plantando mudas com uma educadora",
    altDetalhe: "Uma menina mostra uma muda com terra nas mãos enquanto colegas e uma educadora plantam em canteiros no pátio da escola, com uma composteira de madeira ao fundo",
    resumo:
      "Levamos oficinas de educação ambiental e cultivo sustentável para escolas.",
    descricao:
      "Oficinas de sustentabilidade, compostagem e cultivo são realizadas em escolas públicas.",
    detalhe: {
      titulo: "Atividades",
      itens: ["Plantio de hortaliças.", "Educação ambiental.", "Compostagem."],
    },
  },
  {
    id: "colheita-solidaria",
    titulo: "Colheita Solidária",
    imagem: "colheita-solidaria",
    altCard: "Cestas de vime com alfaces, cenouras, couves, tomates e abóboras recém-colhidos",
    altDetalhe: "Duas voluntárias organizam em cestas as hortaliças colhidas, sobre uma mesa ao lado da horta, para distribuição às famílias",
    resumo:
      "Parte dos alimentos produzidos nas hortas é destinada a famílias da comunidade.",
    descricao:
      "Parte dos alimentos cultivados é distribuída gratuitamente para famílias da comunidade.",
    detalhe: {
      titulo: "Como funciona",
      texto:
        "Os alimentos excedentes das hortas participantes são separados e destinados às famílias atendidas pelo projeto.",
    },
  },
];
