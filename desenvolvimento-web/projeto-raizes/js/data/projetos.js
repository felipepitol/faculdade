/*
   Dados dos projetos.
   Os templates da home e da página de projetos são gerados a partir desta lista.
*/

export const projetos = [
  {
    id: "horta-no-bairro",
    titulo: "Horta no Bairro",
    imagem: "../imagens/horta-no-bairro.svg",
    altCard: "Horta comunitária cultivada por moradores",
    altDetalhe: "Moradores trabalhando em uma horta comunitária",
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
    imagem: "../imagens/raizes-na-escola.svg",
    altCard: "Estudantes participando de atividade de educação ambiental",
    altDetalhe: "Alunos participando de atividade de plantio",
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
    imagem: "../imagens/colheita-solidaria.svg",
    altCard: "Alimentos colhidos para distribuição comunitária",
    altDetalhe: "Cestas de alimentos destinadas à comunidade",
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
