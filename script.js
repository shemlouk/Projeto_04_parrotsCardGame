const jogo = document.querySelector(".jogo");
const timer = document.querySelector(".timer");
const cardImages = [
  "bobross",
  "explody",
  "fiesta",
  "metal",
  "revertit",
  "triplets",
  "unicorn",
];

const gameSounds = {
  cardFlip: new Audio("./assets/audio/card-flip.mp3"),
  fail: new Audio("./assets/audio/fail.mp3"),
  match: new Audio("./assets/audio/win.mp3"),
  victory: new Audio("./assets/audio/victory.mp3"),
};

//---------------------------------------------------------------------

const cartas = [];
const jogada = [];
const jogadas = [];
let qtdCartas = 0;
let cliques = 0;
let tempo = 0;
let intervalID = null;
let bloqueiaCartas = false;

//=====================================================================

iniciaJogo();

//=====================================================================

function iniciaJogo() {
  perguntaQtd();
  const startTime = new Date().getTime();
  iniciaTimer(startTime);
  criaCartas();
  adicionaEventoDeClique();
}

//---------------------------------------------------------------------

function iniciaTimer(inicio) {
  const contador = setInterval(() => {
    const diferenca = new Date().getTime() - inicio;
    tempo = new Date(diferenca).toISOString().substr(14, 5);
    timer.innerHTML = tempo;
    intervalID = contador;
  }, 1000);
}
//---------------------------------------------------------------------

function adicionaEventoDeClique() {
  cartas.forEach((carta) => {
    carta.addEventListener("click", (e) => {
      const cartaClicada = e.currentTarget;
      if (!jogadas.includes(cartaClicada) && !jogada.includes(cartaClicada)) {
        gameSounds.cardFlip.play();
        viraCarta(cartaClicada);
        jogada.push(cartaClicada);
        cliques++;
      }
      if (jogada.length === 2) validaJogada();
      if (jogadas.length == qtdCartas && !bloqueiaCartas) {
        let time = 0;
        cartas.forEach((carta) => {
          setTimeout(() => {
            carta.classList.add("jump");
          }, time);
          time += 50;
        });
        gameSounds.victory.play();
        setTimeout(fimDeJogo, 1500);
      }
    });
  });
}

function validaJogada() {
  const primeiraCarta = jogada[0];
  const segundaCarta = jogada[1];
  const valorPrimeiraCarta = jogada[0].getAttribute("data-image");
  const valorSegundaCarta = jogada[1].getAttribute("data-image");

  if (valorPrimeiraCarta === valorSegundaCarta) {
    growCartas(primeiraCarta, segundaCarta);
    gameSounds.match.play();
    jogadas.push(...jogada);
    jogada.splice(0, 2);
    setTimeout(() => {
      growCartas(primeiraCarta, segundaCarta);
    }, 1000);
  } else {
    setTimeout(() => {
      gameSounds.fail.play();
      shakeCartas(primeiraCarta, segundaCarta);
      setTimeout(() => {
        shakeCartas(primeiraCarta, segundaCarta);
        viraCarta(primeiraCarta);
        viraCarta(segundaCarta);
        jogada.splice(0, 2);
      }, 1000);
    }, 200);
  }
}

function shakeCartas(carta1, carta2) {
  carta1.classList.toggle("shake");
  carta2.classList.toggle("shake");
}

function growCartas(carta1, carta2) {
  carta1.classList.toggle("grow");
  carta2.classList.toggle("grow");
}

function viraCarta(card) {
  card.classList.toggle("clicado");
  const value = card.getAttribute("data-image");
  const image = card.querySelector(".card__image");
  image.classList.toggle(value);
}

function fimDeJogo() {
  alert(`Você venceu em ${cliques} jogadas!\nTempo total de jogo: ${tempo}`);
  pergutaJogarNovamente();
}

function pergutaJogarNovamente() {
  const jogarNovamente = prompt("Deseja jogar novamente?");
  if (jogarNovamente === "sim") {
    reset();
    iniciaJogo();
  } else if (jogarNovamente === "não") {
    clearInterval(intervalID);
    bloqueiaCartas = true;
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
  tempo = 0;
  timer.innerHTML = "00:00";
  clearInterval(intervalID);
}
