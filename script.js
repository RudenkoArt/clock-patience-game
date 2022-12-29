const { body } = document;
const modal = document.querySelector('.modal');
const piles = document.querySelectorAll('.pile');
const restart = document.getElementById('restart');
const mute = document.getElementById('mute');
const time = document.querySelector('.time');
const bestTimeEl = document.getElementById('best-time');

// Game Conditions
let isFirstGame = true;
let totalCardsMoved;
let kingsRevealed;

// Time
let startingTime;
let timer;

// Drag Functionality
let currentPileId;
let draggedItem;

// Sounds
let isMuted = false;
const cardFlipSound = new Audio('./sounds/card-flip.mp3');
const cardDropSound = new Audio('./sounds/card-drop.mp3');

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

// Shuffle Cards
function shuffleCardsArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Check Win/Loss Conditions
function checkGameProgress() {
  if (kingsRevealed === 4) {
    // Stop Timer
    clearInterval(timer);
    // Call makePileAvailible with no arguments to disable all piles
    makePileAvailible();
    setTimeout(
      () => (totalCardsMoved === 52 ? showModal(true) : showModal(false)),
      1500
    );
  }
}

// Show Notification Window
function showModal(hasWon) {
  // Clear modal window
  modal.firstElementChild.textContent = '';
  // Message
  const messageEl = document.createElement('h3');
  messageEl.textContent = hasWon ? '🎉 You Win! 🎉' : '😩 You Lost! 😩';
  // Store Best Time
  if (hasWon) storeBestTime();
  // Time
  const yourTimeEl = document.createElement('span');
  yourTimeEl.textContent = `Your time: ${time.textContent.slice(-5)}`;
  const bestTimeEl = document.createElement('span');
  bestTimeEl.textContent = `Best time: ${localStorage.getItem('BestTime')}`;
  // Break
  const breakEl = document.createElement('br');
  // Restart option
  const restartEl = document.createElement('strong');
  restartEl.textContent = hasWon ? 'Restart' : 'Try again';
  restartEl.classList.add('play-again');
  restartEl.setAttribute('onclick', 'startNewGame()');
  // Append
  modal.firstElementChild.append(
    ...(hasWon
      ? [messageEl, yourTimeEl, bestTimeEl, breakEl, restartEl]
      : [messageEl, breakEl, restartEl])
  );
  // Store Best Time
  // Show Modal
  modal.style.display = 'flex';
}

// Timer
function startTimer() {
  startingTime = Date.now();
  timer = setInterval(() => {
    const diff = Date.now() - startingTime;
    let s = Math.floor((diff / 1000) % 60);
    let m = Math.floor(diff / 1000 / 60);
    s = s < 10 ? `0${s}` : s;
    m = m < 10 ? `0${m}` : m;
    time.textContent = `Time: ${m}:${s}`;
  }, 100);
}

// Drag n' Drop
function dragStart(e) {
  draggedItem = e.target;
  setTimeout(() => {
    makePileAvailible(draggedItem.name);
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
  if (draggedItem.name === 'king') kingsRevealed++;
  totalCardsMoved++;
  checkGameProgress();
  if (!isMuted) cardDropSound.play();
}

// Create Playing Card
function createCardEl(cardName) {
  const cardEl = document.createElement('img');
  cardEl.src = `./cards/${cardName}.png`;
  cardEl.draggable = false;
  cardEl.setAttribute('ondragstart', 'dragStart(event)');
  cardEl.setAttribute('name', cardName.slice(0, cardName.indexOf('_')));
  cardEl.classList.add('back-side');
  cardEl.addEventListener('click', () => {
    if (cardEl.classList.contains('back-side')) {
      cardEl.classList.remove('back-side');
      // Add .flipping to trigger the animation
      cardEl.classList.add('flipping');
      cardEl.draggable = true;
      if (!isMuted) cardFlipSound.play();
    }
    // Remove .flipping to prevent further animation triggers
    cardEl.addEventListener('animationend', () => {
      cardEl.classList.remove('flipping');
    });
  });
  return cardEl;
}

// Append Card Elements into Piles
function populateDOM() {
  // Clear Piles
  if (!isFirstGame) piles.forEach((pile) => (pile.textContent = ''));
  const cardEls = cardsArray.map((card) => createCardEl(card));
  piles.forEach((pile, idx) => {
    // Start timer when first Card is clicked
    if (idx === 12)
      cardEls[3].addEventListener('click', function () {
        startTimer();
        // Remove this event immediately after click
        this.removeEventListener('click', arguments.callee);
      });
    pile.append(...cardEls.splice(0, 4));
  });
}

// Trigger transitions by changing CSS root variables
function setRootVarieble(name, value) {
  return document.documentElement.style.setProperty(name, value);
}

function firstDealAnimation() {
  setRootVarieble('--radius', '40vmin');
  setRootVarieble('--r-offset', '-0.25turn');
}

function nextDealAnimation() {
  setRootVarieble('--radius', '0');
  setRootVarieble('--r-offset', '-1.75turn');
  // Disable page clickability during transitions
  body.style.pointerEvents = 'none';
  setTimeout(() => {
    body.style.pointerEvents = '';
  }, 3000);
  // Set Event Listener to one of the piles
  piles[0].addEventListener('transitionend', nextDealAnimationEnd);
}

function nextDealAnimationEnd() {
  setRootVarieble('--radius', '40vmin');
  setRootVarieble('--r-offset', '-0.25turn');
  // Remove Event Listener
  piles[0].removeEventListener('transitionend', nextDealAnimationEnd);
}

function dealCards() {
  if (isFirstGame) {
    firstDealAnimation();
  } else {
    nextDealAnimation();
  }
}

function makePileAvailible(id) {
  piles.forEach((pile) => {
    pile.style.pointerEvents = pile.id === id ? '' : 'none';
  });
}

function muteSounds() {
  isMuted = !isMuted;
  if (isMuted) {
    mute.classList.replace('fa-volume-high', 'fa-volume-xmark');
    mute.title = 'Unmute';
  } else {
    mute.classList.replace('fa-volume-xmark', 'fa-volume-high');
    mute.title = 'Mute';
  }
}

// Store and get Best Time
function checkBestTime() {
  bestTimeEl.textContent = localStorage.getItem('BestTime')
    ? `Best Time: ${localStorage.getItem('BestTime')}`
    : 'Best Time: --:--';
}

function storeBestTime() {
  const currentTime = time.textContent.slice(-5);
  const bestTime = localStorage.getItem('BestTime');
  if (!bestTime || bestTime > currentTime)
    localStorage.setItem('BestTime', currentTime);
}

// Start Game
function startNewGame() {
  currentPileId = 'king';
  totalCardsMoved = 51;
  kingsRevealed = 4;
  modal.style.display = 'none';
  clearInterval(timer);
  time.textContent = 'Time: 00:00';
  makePileAvailible(currentPileId);
  shuffleCardsArray(cardsArray);
  populateDOM();
  dealCards();
  checkBestTime();
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

// Restart game
restart.addEventListener('click', startNewGame);

// Sounds Off/On
mute.addEventListener('click', muteSounds);

// On Load
startNewGame();
