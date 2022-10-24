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

/* Função principal */

iniciaJogo();

function iniciaJogo() {
  perguntaQtd();
  iniciaTimer();
  criaCartas();
  adicionaEventoDeClique();
}

//---------------------------------------------------------------------

/* FUNÇÃO - Timer */

function iniciaTimer() {
  const startTime = new Date().getTime();
  const contador = setInterval(() => {
    const diferenca = new Date().getTime() - startTime;
    tempo = new Date(diferenca).toISOString().substr(14, 5);
    timer.innerHTML = tempo;
    intervalID = contador;
  }, 1000);
}
//---------------------------------------------------------------------

/* FUNÇÃO - Clique nas cartas */

function adicionaEventoDeClique() {
  cartas.forEach((carta) => {
    carta.addEventListener("click", (e) => {
      // Define a carta clicada
      const cartaClicada = e.currentTarget;
      // Se a carta clicada não estiver já virada:
      if (
        !jogadas.includes(cartaClicada) &&
        !jogada.includes(cartaClicada) &&
        !bloqueiaCartas
      ) {
        gameSounds.cardFlip.play();
        viraCarta(cartaClicada);
        jogada.push(cartaClicada);
        cliques++;
      }
      // Se a última carta adicionada na jogada completa ela:
      if (jogada.length === 2 && !bloqueiaCartas) validaJogada();
      // Se a última carta adicionada nas jogadas completa o jogo:
      if (jogadas.length == qtdCartas && !bloqueiaCartas) {
        //Adiciona animação de pulo das cartas em times diferentes
        let time = 0;
        setTimeout(() => {
          cartas.forEach((carta) => {
            setTimeout(() => {
              carta.classList.add("jump");
            }, time);
            time += 50;
          });
        }, 1200);

        //Realiza procedimentos de fim de jogo
        gameSounds.victory.play();
        setTimeout(fimDeJogo, 2000);
      }
    });
  });
}

/* FUNÇÃO - Valida a jogada das cartas */

function validaJogada() {
  const primeiraCarta = jogada[0];
  const segundaCarta = jogada[1];
  const valorPrimeiraCarta = jogada[0].getAttribute("data-image");
  const valorSegundaCarta = jogada[1].getAttribute("data-image");

  // Se as cartas derem match:
  if (valorPrimeiraCarta === valorSegundaCarta) {
    setTimeout(() => {
      growCartas(primeiraCarta, segundaCarta);
    }, 400);
    gameSounds.match.play();
    jogadas.push(...jogada);
    jogada.splice(0, 2);
    setTimeout(() => {
      growCartas(primeiraCarta, segundaCarta);
    }, 1400);
  }

  // Se as cartas NÃO derem match:
  else {
    bloqueiaCartas = true;
    setTimeout(() => {
      gameSounds.fail.play();
      shakeCartas(primeiraCarta, segundaCarta);
      setTimeout(() => {
        shakeCartas(primeiraCarta, segundaCarta);
        viraCarta(primeiraCarta);
        viraCarta(segundaCarta);
        jogada.splice(0, 2);
        bloqueiaCartas = false;
      }, 1000);
    }, 200);
  }
}

/* FUNÇÕES - Animações */

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

/* FUNÇÕES - Fim de jogo */

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

/* FUNÇÕES - Cria as cartas e as coloca no jogo */

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

/* FUNÇÕES - Pergunta a quantidade e valida ela */

function perguntaQtd() {
  qtdCartas = prompt("Escolha de 4 à 14 cartas para jogar (somente pares!):");
  if (!validaQtd(qtdCartas)) perguntaQtd();
}

function validaQtd(qtd) {
  return qtd >= 4 && qtd <= 14 && qtd % 2 === 0;
}

//---------------------------------------------------------------------

/* FUNÇÃO - Reset do jogo */

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
