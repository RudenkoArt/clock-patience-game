const modal = document.querySelector('.modal');
const piles = document.querySelectorAll('.pile');
const restart = document.getElementById('restart');

// Game Conditions
let isFirstGame = true;
let totalCardsRevealed = 0;
let kingsRevealed = 0;

// Drag Functionality
let currentPileId;
let draggedItem;

// Cards
// prettier-ignore
const cardsArray = [
  '2_of_clubs', '2_of_diamonds', '2_of_hearts', '2_of_spades',
  '3_of_clubs', '3_of_diamonds', '3_of_hearts', '3_of_spades',
  '4_of_clubs', '4_of_diamonds', '4_of_hearts', '4_of_spades',
  '5_of_clubs', '5_of_diamonds', '5_of_hearts', '5_of_spades',
  '6_of_clubs', '6_of_diamonds', '6_of_hearts', '6_of_spades',
  '7_of_clubs', '7_of_diamonds', '7_of_hearts', '7_of_spades',
  '8_of_clubs', '8_of_diamonds', '8_of_hearts', '8_of_spades',
  '9_of_clubs', '9_of_diamonds', '9_of_hearts', '9_of_spades',
  '10_of_clubs', '10_of_diamonds', '10_of_hearts', '10_of_spades',
  'jack_of_clubs', 'jack_of_diamonds', 'jack_of_hearts', 'jack_of_spades',
  'queen_of_clubs', 'queen_of_diamonds', 'queen_of_hearts', 'queen_of_spades',
  'king_of_clubs', 'king_of_diamonds', 'king_of_hearts', 'king_of_spades',
  'ace_of_clubs', 'ace_of_diamonds', 'ace_of_hearts', 'ace_of_spades',
];

function shuffleCardsArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Drag n' Drop
function dragStart(e) {
  draggedItem = e.target;
  setTimeout(() => {
    makePileAvailible(draggedItem.id);
    draggedItem.hidden = true;
  }, 10);
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  const parentContainer = e.target.closest('div');
  draggedItem.classList.add('played');
  draggedItem.setAttribute('draggable', 'false');
  draggedItem.hidden = false;
  parentContainer.appendChild(draggedItem);
  currentPileId = parentContainer.id;
}

// Check Win/Loss Conditions
function checkGameProgress() {
  if (kingsRevealed === 4)
    // create showModal function
    setTimeout(() => (modal.style.display = 'flex'), 500);
}

function createCardEl(cardName) {
  const cardEl = document.createElement('img');
  cardEl.src = `./cards/${cardName}.png`;
  cardEl.id = cardName.slice(0, cardName.indexOf('_'));
  cardEl.draggable = false;
  cardEl.setAttribute('ondragstart', 'dragStart(event)');
  cardEl.classList.add('back-side');
  cardEl.addEventListener('click', () => {
    if (cardEl.classList.contains('back-side')) {
      cardEl.classList.remove('back-side');
      cardEl.draggable = true;
      if (cardEl.id === 'king') kingsRevealed++;
      totalCardsRevealed++;
      checkGameProgress();
    }
  });
  return cardEl;
}

function populateDOM() {
  // Clear Piles
  if (!isFirstGame) piles.forEach((pile) => (pile.textContent = ''));
  const cardEls = cardsArray.map((card) => createCardEl(card));
  piles.forEach((pile) => {
    pile.append(...cardEls.splice(0, 4));
  });
}

function setRootVarieble(name, value) {
  return document.documentElement.style.setProperty(name, value);
}

// Trigger CSS transitions by changing root variables
function dealCards() {
  if (isFirstGame) {
    setRootVarieble('--radius', '40vmin');
    setRootVarieble('--r-offset', '-0.25turn');
  } else {
    setRootVarieble('--radius', '0');
    setRootVarieble('--r-offset', '-1.75turn');
    setTimeout(() => {
      setRootVarieble('--radius', '40vmin');
      setRootVarieble('--r-offset', '-0.25turn');
    }, 1500);
  }
}

function makePileAvailible(id) {
  piles.forEach((pile) => {
    pile.style.pointerEvents = pile.id === id ? '' : 'none';
  });
}

function startGame() {
  currentPileId = 'king';
  makePileAvailible(currentPileId);
  shuffleCardsArray(cardsArray);
  populateDOM();
  dealCards();
  if (isFirstGame) isFirstGame = !isFirstGame;
}

// Event Listeners
piles.forEach((pile) => {
  pile.addEventListener('dragover', allowDrop);
  pile.addEventListener('drop', drop);
});

// When drag event was interrupted before drop()
window.addEventListener('dragend', (e) => {
  if (e.dataTransfer.dropEffect === 'none') {
    makePileAvailible(currentPileId);
    draggedItem.hidden = false;
  }
});

restart.addEventListener('click', startGame);

// On Load
startGame();

/* TODO: 
- fix drop function on kings
- add cards sounds
- rewrite pile and card ids, since id is unique
- disble restart btn during shuffle 
- add borders for piles
- add imgs inside of a pile border
- add soliter win animation (waterfall)
- add flip card animation
- add UI counter and timer
- light up needed pile +-
*/
