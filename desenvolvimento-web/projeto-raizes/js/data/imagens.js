/*
   Configuração das fotos responsivas.
   Usada pelo template <picture> (js/templates/imagem.js) e pelo script
   que gera os arquivos (scripts/imagens.mjs): os dois leem daqui para
   nunca pedirem uma largura ou formato que não existe.
*/

/* Larguras geradas, em px. 1536 é a largura dos originais. */
export const LARGURAS = [480, 800, 1200, 1536];

/* Do mais leve para o mais compatível; o JPEG é a reserva do <img> */
export const FORMATOS = ["avif", "webp", "jpg"];

/* Proporção de exibição (16:10), igual ao width/height do <img> */
export const PROPORCAO = 16 / 10;

/*
   Largura que cada foto ocupa na tela, por contexto (atributo sizes).
   Acompanha os breakpoints do css/style.css: acima de 992px o hero e
   o projeto ocupam meia coluna e os cards um terço; abaixo, a largura
   da tela (ou metade, para os cards entre 769 e 992px).
*/
export const TAMANHOS = {
  hero: "(max-width: 992px) 100vw, 600px",
  card: "(max-width: 768px) 100vw, (max-width: 992px) 50vw, 384px",
  projeto: "(max-width: 992px) 100vw, 560px",
};
