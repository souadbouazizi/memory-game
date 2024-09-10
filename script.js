


// Global variables
let score = 0;
let timer;
let firstPick = null;
let secondPick = null;
let isChecking = false;
let currentGameId = '';

// Initialize the game board for a specific game
function initGame(gameId) {
    currentGameId = gameId; // Set the current game ID
    let imgArray;
    let folder;

    // Define images and folder based on the gameId
    switch (gameId) {
        case 'game1':
            imgArray = [
                'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg',
                'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg'
            ];
            folder = 'game1';
            break;
  
       
            // Add more cases for other games here
    }

    const shuffledImages = shuffleArray(imgArray);
    const gameGrid = document.getElementById(`${gameId}-game-grid`);

    gameGrid.innerHTML = ''; // Clear the grid
    shuffledImages.forEach((imageSrc, index) => {
        const square = document.createElement('div');
        square.classList.add('square', 'hidden');
        square.dataset.image = imageSrc;
        square.dataset.index = index;

        const img = document.createElement('img');
        img.src = `./images/${folder}/${imageSrc}`;
        img.alt = 'Game Image';
        img.classList.add('hidden'); // Hide the image initially
        img.style = 'border:4px solid';  //add border to images

        square.appendChild(img);

        square.addEventListener('click', handleSquareClick);
        gameGrid.appendChild(square);
    });

    score = 0;
    updateScore();
    resetTimer();
}

// Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Handle click event on squares
function handleSquareClick(event) {
    // Ensure the event target is the square and not the image itself
    const square = event.target.classList.contains('square') ? event.target : event.target.parentElement;
    
    if (isChecking || square.classList.contains('matched') || !square.classList.contains('hidden')) return;

    const img = square.querySelector('img');

    // Show the image
    square.classList.remove('hidden');
    img.classList.remove('hidden');

    if (!firstPick) {
        firstPick = square;
    } else if (!secondPick && square !== firstPick) {
        secondPick = square;
        isChecking = true;
        setTimeout(checkForMatch, 500); // Delay to allow player to see both images
    }
}

// Check if two picked squares match
function checkForMatch() {
    const firstImg = firstPick.querySelector('img');
    const secondImg = secondPick.querySelector('img');

    if (firstPick.dataset.image === secondPick.dataset.image) {
        firstPick.classList.add('matched');
        secondPick.classList.add('matched');
        score += 10;
    } else {
        firstPick.classList.add('hidden');
        secondPick.classList.add('hidden');
        firstImg.classList.add('hidden');
        secondImg.classList.add('hidden');
        score -= 2;
    }

    firstPick = null;
    secondPick = null;
    isChecking = false;
    updateScore();
}

// Update the score display
function updateScore() {
    const scoreElement = document.getElementById(`${currentGameId}-score`);
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

// Start the timer
function startTimer() {
    let timeLeft = 60;
    const timerElement = document.getElementById(`${currentGameId}-timer`);
    if (timerElement) {
        timerElement.textContent = timeLeft;

        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }
}

// Reset the timer
function resetTimer() {
    clearInterval(timer);
    const timerElement = document.getElementById(`${currentGameId}-timer`);
    if (timerElement) {
        timerElement.textContent = 60;
    }
}

// End the game
function endGame() {
    alert(`Time's up! Your final score is ${score}.`);
    document.getElementById(`${currentGameId}-start-btn`).disabled = false;
}

// Start the game when the "Start Game" button is clicked
document.querySelectorAll('.btn').forEach(button => {
    if (button.id.includes('start-btn')) {
        button.addEventListener('click', () => {
            const gameId = button.dataset.gameId;
            initGame(gameId);
            startTimer();
            button.disabled = true;
        });
    }
});
