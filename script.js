const piles = document.querySelectorAll('.pile');
const borders = document.querySelectorAll('.border');

// Game Conditions
let totalCardsRevealed = 0;
let kingsRevealed = 0;

// Drag Functionality
let previousPile;
let draggedItem;

const cardsArray = [
  '2_of_clubs',
  '2_of_diamonds',
  '2_of_hearts',
  '2_of_spades',
  '3_of_clubs',
  '3_of_diamonds',
  '3_of_hearts',
  '3_of_spades',
  '4_of_clubs',
  '4_of_diamonds',
  '4_of_hearts',
  '4_of_spades',
  '5_of_clubs',
  '5_of_diamonds',
  '5_of_hearts',
  '5_of_spades',
  '6_of_clubs',
  '6_of_diamonds',
  '6_of_hearts',
  '6_of_spades',
  '7_of_clubs',
  '7_of_diamonds',
  '7_of_hearts',
  '7_of_spades',
  '8_of_clubs',
  '8_of_diamonds',
  '8_of_hearts',
  '8_of_spades',
  '9_of_clubs',
  '9_of_diamonds',
  '9_of_hearts',
  '9_of_spades',
  '10_of_clubs',
  '10_of_diamonds',
  '10_of_hearts',
  '10_of_spades',
  'ace_of_clubs',
  'ace_of_diamonds',
  'ace_of_hearts',
  'ace_of_spades',
  'jack_of_clubs',
  'jack_of_diamonds',
  'jack_of_hearts',
  'jack_of_spades',
  'king_of_clubs',
  'king_of_diamonds',
  'king_of_hearts',
  'king_of_spades',
  'queen_of_clubs',
  'queen_of_diamonds',
  'queen_of_hearts',
  'queen_of_spades',
];

// prettier-ignore
const pilesNumber = { ace:1, jack:11, queen:12, king:13 };

// function patience(cards) {
//   const deck = [...cards];
//   // prettier-ignore
//   const cardValues = { A:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9,10:10, J:11, Q:12, K:13 };
//   // prettier-ignore
//   const table = { 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[], 10:[], 11:[], 12:[], 13:[] };

//   let i = 1;
//   let fourKings = 0;
//   let revealedCardPile = 13;

//   while (deck.length > 0) {
//     table[i] = table[i].concat(deck.shift());
//     if (i === 13) {
//       i = 1;
//     } else i++;
//   }

//   while (fourKings < 4) {
//     const revealedCard = table[revealedCardPile].pop();
//     if (revealedCard === 'K') fourKings++;
//     revealedCardPile = cardValues[revealedCard];
//   }

//   return Object.values(table).reduce((acc, arr) => (acc += arr.length), 0);
// }

/* <img class='back-side' src='./cards/10_of_clubs.png' alt='center' />; */

// Drag n' Drop
function dragStart(e) {
  draggedItem = e.target;

  makePileActive(draggedItem.id);

  //   setTimeout(() => {
  //     // draggedItem.hidden = true;
  //   }, 10);
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const parentContainer = e.target.closest('div');
  draggedItem.classList.add('played');
  //   draggedItem.hidden = false;
  parentContainer.appendChild(draggedItem);
}

function startGame() {
  shuffleCardsArray(cardsArray);
  populateDOM();
}

function shuffleCardsArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function makePileActive(card) {
  console.log(card);
  const activePile = document.querySelector(
    `.pile-${pilesNumber[card] ? pilesNumber[card] : card}`
  );
  activePile.style.zIndex = 100;
}

function createCardEl(cardName) {
  const cardEl = document.createElement('img');
  cardEl.src = `./cards/${cardName}.png`;
  cardEl.id = cardName.slice(0, cardName.indexOf('_'));
  cardEl.draggable = true;
  cardEl.setAttribute('ondragstart', 'dragStart(event)');
  cardEl.classList.add('back-side');
  cardEl.addEventListener('click', () => {
    if (cardEl.classList.contains('back-side')) {
      cardEl.classList.remove('back-side');
      console.log(123);
    }
  });
  return cardEl;
}

function populateDOM() {
  const cards = [...cardsArray];
  piles.forEach((pile) => {
    const stack = cards.splice(0, 4);
    const cardEls = stack.map((card) => createCardEl(card));
    cardEls.forEach((cardEl) => pile.firstElementChild.appendChild(cardEl));
  });
}

// Event Listeners
borders.forEach((border) => {
  border.addEventListener('dragover', allowDrop);
  border.addEventListener('drop', drop);
});

// On Load
startGame();
