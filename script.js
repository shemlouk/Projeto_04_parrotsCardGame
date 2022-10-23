const jogo = document.querySelector(".jogo");
const cardImages = [
  "bobross",
  "explody",
  "fiesta",
  "metal",
  "revertit",
  "triplets",
  "unicorn",
];

const cartas = [];
const jogada = [];
let qtdCartas = 0;
let cliques = 0;

//=====================================================================

iniciaJogo();

//=====================================================================

function iniciaJogo() {
  reset();
  perguntaQtd();
  criaCartas();
}

//---------------------------------------------------------------------

function criaCartas() {
  //Cria as cartas
  while (qtdCartas > cartas.length) {
    const carta = criaCarta();
    cartas.push(carta);
  }
  //Marca a carta com a gif que ela vai ter
  cartas.map((carta, index) => {
    const image = cardImages[index % (qtdCartas / 2)];
    return carta.setAttribute("data-image", image);
  });
  //Embaralha as cartas
  cartas.sort(() => {
    return Math.random() - 0.5;
  });
  //Adiciona as cartas no jogo
  cartas.forEach((carta) => {
    jogo.appendChild(carta);
  });
}

function criaCarta() {
  const card = document.createElement("div");
  const image = document.createElement("div");
  card.classList.add("card");
  image.classList.add("card__image");
  card.appendChild(image);
  return card;
}

//---------------------------------------------------------------------

function perguntaQtd() {
  qtdCartas = prompt("Escolha de 4 à 14 cartas para jogar (somente pares!):");
  if (!validaQtd(qtdCartas)) perguntaQtd();
}

function validaQtd(qtd) {
  return qtd >= 4 && qtd <= 14 && qtd % 2 === 0;
}

//---------------------------------------------------------------------

function reset() {
  qtdCartas = 0;
  cartas.splice(0, cartas.length);
}
