const cards = document.querySelectorAll('img');

cards.forEach((card) =>
  card.addEventListener('click', (e) => {
    e.target.classList.toggle('back');
    console.log(123);
  })
);

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

window.addEventListener('click', (e) => {
  console.log(e.target);
});
