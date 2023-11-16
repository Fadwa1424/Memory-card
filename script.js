// script.js
let flippedCards = [];
let isProcessing = false;
let correctVotes = 0;
let totalPairs = 5; // Assuming there are 5 pairs in the game

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function initializeGame() {
    const fruitsAndVegetables = ['🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍊', '🍊', '🍓', '🍓',];
    const shuffledCards = shuffle([...fruitsAndVegetables, ...fruitsAndVegetables.slice(0, fruitsAndVegetables.length / 5)]);

    const gameBoard = document.getElementById('game-board');

    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.card = card;
        cardElement.addEventListener('click', flipCard);

        gameBoard.appendChild(cardElement);
    });

    function flipCard() {
        if (isProcessing || this.classList.contains('matched')) {
            return;
        }

        // Play the click sound
        const clickSound = document.getElementById('click-sound');
        clickSound.play();

        // Toggle the 'flipped' class for rotation effect
        this.classList.toggle('flipped');

        if (this.classList.contains('flipped')) {
            // Play the flip sound
            const flipSound = document.getElementById('flip-sound');
            flipSound.play();

            // Flip the card
            this.textContent = this.dataset.card;
            this.style.backgroundColor = '#ffd700';
            flippedCards.push(this);
        } else {
            // Unflip the card
            this.textContent = '';
            this.style.backgroundColor = '#ffffff';
            const index = flippedCards.indexOf(this);
            if (index !== -1) {
                flippedCards.splice(index, 1);
            }
        }

        if (flippedCards.length === 2) {
            isProcessing = true;
            setTimeout(checkMatch, 500);
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.card === card2.dataset.card) {
            card1.classList.add('hidden', 'matched');
            card2.classList.add('hidden', 'matched');
            correctVotes++;

            // Check if all pairs are matched
            if (correctVotes === totalPairs) {
                playAchievementSound();
            } else {
                playMatchSound(); // Play the match sound
            }
        } else {
            playLossSound();
        }

        resetFlippedCards();
    }

    function playAchievementSound() {
        const achievementSound = document.getElementById('achievement-sound');
        achievementSound.play();
    }

    function playLossSound() {
        const lossSound = document.getElementById('loss-sound');
        lossSound.play();
    }

    function playMatchSound() {
        const matchSound = document.getElementById('match-sound');
        matchSound.play();
    }

    function resetFlippedCards() {
        flippedCards.forEach(card => {
            card.classList.remove('flipped');
            card.textContent = '';
            card.style.backgroundColor = '#ffffff';
        });

        flippedCards = [];
        isProcessing = false;
    }
}

// Call initializeGame to start the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});
