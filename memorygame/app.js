document.addEventListener('DOMContentLoaded', () => {
	const cardArray = [
		{
			name: 'octopus',
			img: 'images/octopus.png'
		},
		{
			name: 'octopus',
			img: 'images/octopus.png'
		},
		{
			name: 'penguin',
			img: 'images/penguin.png'
		},
		{
			name: 'penguin',
			img: 'images/penguin.png'
		},
		{
			name: 'panda',
			img: 'images/panda.png'
		},
		{
			name: 'panda',
			img: 'images/panda.png'
		},
		{
			name: 'hamster',
			img: 'images/hamster.png'
		},
		{
			name: 'hamster',
			img: 'images/hamster.png'
		},
		{
			name: 'fox',
			img: 'images/fox.png'
		},
		{
			name: 'fox',
			img: 'images/fox.png'
		},
		{
			name: 'cat',
			img: 'images/cat.png'
		},
		{
			name: 'cat',
			img: 'images/cat.png'
		}
    ];

	const spaceCardArray = [
		{
			name: 'earth',
			img: 'space/earth.png'
		},
		{
			name: 'earth',
			img: 'space/earth.png'
		},
		{
			name: 'jupiter',
			img: 'space/jupiter.png'
		},
		{
			name: 'jupiter',
			img: 'space/jupiter.png'
		},
		{
			name: 'mars',
			img: 'space/mars.png'
		},
		{
			name: 'mars',
			img: 'space/mars.png'
		},
		{
			name: 'neptune',
			img: 'space/neptune.png'
		},
		{
			name: 'neptune',
			img: 'space/neptune.png'
		},
		{
			name: 'saturn',
			img: 'space/saturn.png'
		},
		{
			name: 'saturn',
			img: 'space/saturn.png'
		},
		{
			name: 'venus',
			img: 'space/venus.png'
		},
		{
			name: 'venus',
			img: 'space/venus.png'
		}
    ];

	let cardsChosen = [];
	let cardsChosenId = [];
	let cardsWon = [];
	let arrayChosen = cardArray; // Default card set
	const grid = document.querySelector('.grid');
	const resultDisplay = document.querySelector('#result');
	const highScoreDisplay = document.getElementById('highscore');
	let timer;
	let timeLimit = 25; // 25 seconds for hard mode
	let isHardMode = false;
	let startTime = null;
	let highScore = localStorage.getItem('highScore');
	highScore = highScore ? parseFloat(highScore) : Infinity;

	highScoreDisplay.textContent = highScore === Infinity ? 'No high score yet' : `High Score: ${highScore}s`;

	function selectCardPack() {
		const selectedValue = document.getElementById('cards').value;
		if (selectedValue === 'space') {
			arrayChosen = spaceCardArray;
		} else if (selectedValue === 'animals') {
			arrayChosen = cardArray;
		}
		resetGame();
	}

	function createBoard() {
		grid.innerHTML = '';
		for (let i = 0; i < arrayChosen.length; i++) {
			const card = document.createElement('img');
			card.setAttribute('src', arrayChosen === spaceCardArray ? 'space/galaxy.png' : 'images/blank.png');
			card.setAttribute('data-id', i);
			card.addEventListener('click', flipCard);
			grid.appendChild(card);
		}
	}

	function checkForMatch() {
		const cards = document.querySelectorAll('img');
		const optionOneId = cardsChosenId[0];
		const optionTwoId = cardsChosenId[1];

		if (optionOneId === optionTwoId) {
			cards[optionOneId].setAttribute('src', arrayChosen === spaceCardArray ? 'space/galaxy.png' : 'images/blank.png');
			cards[optionTwoId].setAttribute('src', arrayChosen === spaceCardArray ? 'space/galaxy.png' : 'images/blank.png');
		} else if (cardsChosen[0] === cardsChosen[1]) {
			cards[optionOneId].setAttribute('src', 'images/white.png');
			cards[optionTwoId].setAttribute('src', 'images/white.png');
			cards[optionOneId].removeEventListener('click', flipCard);
			cards[optionTwoId].removeEventListener('click', flipCard);
			cardsWon.push(cardsChosen);
		} else {
			cards[optionOneId].setAttribute('src', arrayChosen === spaceCardArray ? 'space/galaxy.png' : 'images/blank.png');
			cards[optionTwoId].setAttribute('src', arrayChosen === spaceCardArray ? 'space/galaxy.png' : 'images/blank.png');
		}

		cardsChosen = [];
		cardsChosenId = [];
		resultDisplay.textContent = cardsWon.length;
		if (cardsWon.length === arrayChosen.length / 2) {
			endGame();
		}
	}

	function flipCard() {
		let cardId = this.getAttribute('data-id');
		if (cardsChosenId.includes(cardId) || cardsChosenId.length === 2) return;
		cardsChosen.push(arrayChosen[cardId].name);
		cardsChosenId.push(cardId);
		this.setAttribute('src', arrayChosen[cardId].img);
		if (cardsChosen.length === 2) {
			setTimeout(checkForMatch, 500);
		}
	}

	function resetGame() {
		clearTimeout(timer);
		cardsChosen = [];
		cardsChosenId = [];
		cardsWon = [];
		arrayChosen.sort(() => 0.5 - Math.random());
		resultDisplay.textContent = '0';
		createBoard();
		if (isHardMode) {
			startTimer();
		}
	}

	function startTimer() {
		startTime = new Date();
		let timeRemaining = timeLimit;
		resultDisplay.textContent = `Time remaining: ${timeRemaining}s`;
		timer = setInterval(() => {
			timeRemaining--;
			resultDisplay.textContent = `Time remaining: ${timeRemaining}s`;
			if (timeRemaining <= 0) {
				clearInterval(timer);
				alert('Time is up! You did not complete the game in time.');
				resetGame();
			}
		}, 1000);
	}

	function endGame() {
		clearInterval(timer);
		const endTime = new Date();
		const timeTaken = (endTime - startTime) / 1000; // Time taken in seconds

		if (timeTaken < highScore) {
			highScore = timeTaken;
			localStorage.setItem('highScore', highScore);
			highScoreDisplay.textContent = `High Score: ${highScore}s`;
		}

		resultDisplay.textContent = 'Congratulations! You found them all!';
	}

	document.getElementById('easyMode').addEventListener('click', () => {
		isHardMode = false;
		document.getElementById("highscore").style.display = 'none';
		resetGame();
	});

	document.getElementById('hardMode').addEventListener('click', () => {
		isHardMode = true;
		document.getElementById("highscore").style.display = 'inline-block';
		resetGame();
	});

	const resetButton = document.getElementById('reset');
	resetButton.addEventListener('click', resetGame);

	document.getElementById('cards').addEventListener('change', selectCardPack);

	createBoard();
});
