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
const jogadas = [];
let qtdCartas = 0;
let cliques = 0;

//=====================================================================

iniciaJogo();

//=====================================================================

function iniciaJogo() {
  perguntaQtd();
  criaCartas();
  adicionaEventoDeClique();
}

//---------------------------------------------------------------------

function adicionaEventoDeClique() {
  cartas.forEach((carta) => {
    carta.addEventListener("click", (e) => {
      const cartaClicada = e.currentTarget;
      if (!jogadas.includes(cartaClicada)) {
        viraCarta(cartaClicada);
        jogada.push(cartaClicada);
        cliques++;
      }
      if (jogada.length === 2) validaJogada();
      if (jogadas.length == qtdCartas) setTimeout(fimDeJogo, 500);
    });
  });
}

function validaJogada() {
  const primeiraCarta = jogada[0];
  const segundaCarta = jogada[1];
  const valorPrimeiraCarta = jogada[0].getAttribute("data-image");
  const valorSegundaCarta = jogada[1].getAttribute("data-image");

  if (valorPrimeiraCarta === valorSegundaCarta) {
    jogadas.push(...jogada);
    jogada.splice(0, 2);
  } else {
    setTimeout(() => {
      viraCarta(primeiraCarta);
      viraCarta(segundaCarta);
      jogada.splice(0, 2);
    }, 1000);
  }
}

function viraCarta(card) {
  card.classList.toggle("clicado");
  const value = card.getAttribute("data-image");
  const image = card.querySelector(".card__image");
  image.classList.toggle(value);
}

function fimDeJogo() {
  alert(`Você venceu em ${cliques} jogadas!`);
  pergutaJogarNovamente();
}

function pergutaJogarNovamente() {
  const jogarNovamente = prompt("Deseja jogar novamente?");
  if (jogarNovamente === "sim") {
    reset();
    iniciaJogo();
  } else if (jogarNovamente === "não") {
    //do something
  } else {
    pergutaJogarNovamente();
  }
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
  jogadas.splice(0, jogadas.length);
  cliques = 0;
  jogo.innerHTML = "";
}
