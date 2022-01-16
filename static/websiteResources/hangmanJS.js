//Word and Defintion list
const randomWords = new Map([
        ['python', 'programming language'],
        ['javascript', 'programming language'],
        ['mongodb', 'programming language'],
        ['json', 'programming language'],
        ['java', 'programming language'],
        ['html', 'programming language'],
        ['css', 'programming language'],
        ['c', 'programming language'],
        ['csharp', 'programming language'],
        ['golang', 'programming language'],
        ['kotlin', 'programming language'],
        ['php', 'programming language'],
        ['sql', 'programming language'],
        ['ruby', 'programming language']
]);

//making a list of only keys from words
const word_list = [...randomWords.keys()];

let answer = '';
let maxWrong = 6;
let mistakes = 0;
let guessed = [];
let score = 0;
let wordStatus = null;
let definition = null;
let finalScore = 0;

document.getElementById('maxWrong').innerHTML = maxWrong;


//Generating a Random word from the list
function randomWord() {
    answer = word_list[Math.floor(Math.random() * word_list.length)]
}
//Generating the Keyboard
function generateButtons() {
    let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => `
        <button
            class="btn btn-lg btn-primary m-2"
            id='` + letter + `'
            onClick="handleGuess('` + letter + `')"
        >
            ` + letter + `
        </button>
        `).join('');

    document.getElementById('keyboard').innerHTML = buttonsHTML;
}
//Handling the guessed letters
function handleGuess(chosenLetter) {
    guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
    document.getElementById(chosenLetter).setAttribute('disabled', true);
    //Seeing if guessed letter matches one in the random word
    if (answer.indexOf(chosenLetter) >= 0) {
        score+= 1;
        guessedWord();
        checkIfGameWon();
        updateScore()
    //Seeing if it doesn't match the random word
    } else if (answer.indexOf(chosenLetter) === -1) {
        mistakes++;
        score-= 1;
        updateMistakes();
        updateScore()
        checkIfGameLost();
        updateHangmanPicture();
    }
}
//Function that updates the picture if you get a wrong guess
function updateHangmanPicture() {
    document.getElementById('hangmanPic').src = './hangmanimages/' + mistakes + '.jpg';
}
//checking if the player has completely guessed the word
function checkIfGameWon() {
    if (wordStatus === answer) {
        document.getElementById('keyboard').innerHTML = 'You Won!!!';
        score+= 20;
        updateScore();
        nextRound()
    }
}
//Checking if the player has reached the max amount of guesses
function checkIfGameLost() {
    if (mistakes === maxWrong) {
        document.getElementById('wordSpotlight').innerHTML = 'The answer was: ' + answer;
        score -= 10;
        updateScore();
        nextRound();
    }
}

//Making the guessed word hide itself into underscores, so the player knows how many letters it has
function guessedWord() {
    wordStatus = answer.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join('');
    document.getElementById('wordSpotlight').innerHTML = wordStatus;
}
//Updating how many mistakes the player has made
function updateMistakes() {
    document.getElementById('mistakes').innerHTML = mistakes;
}
//Updating the score of the player
function updateScore() {
    document.getElementById('score').innerHTML = score;
}

//Fetching the defintion of the word from the list above
function getDefintion() {
    definition = randomWords.get(answer);
    document.getElementById('definition').innerHTML = definition;
}
//Takes the player to the next word, while resetting the mistakes and hangman pic
function nextRound() {
    mistakes = 0;
    guessed = [];
    document.getElementById('hangmanPic').src = './hangmanimages/0.jpg';

    randomWord();
    guessedWord();
    updateMistakes();
    generateButtons();
}

//Reset function that fully resets the game
function playAgain() {
    score = 0;
    mistakes = 0;
    guessed = [];
    document.getElementById('hangmanPic').src = './hangmanimages/0.jpg';

    updateScore();
    randomWord();
    guessedWord();
    updateMistakes();
    generateButtons();
    timer();
    displayTimeLeft();
    startTimer();
}

//Timer that will end game when it reaches 0
let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const buttons = document.querySelectorAll('[data-time]')

function timer(seconds) {
    //clear timer if pressed twice
    clearInterval(countdown);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        const secondsleft = Math.round((then - Date.now()) / 1000);
        //When it reaches 0 seconds it hides the elements of the page and displays score
        if (secondsleft < 0) {
            clearInterval(countdown);
            finalScore = score;
            document.getElementById('keyboard').innerHTML = '';
            document.getElementById('hangmanPic').innerHTML = '';
            document.getElementById('wordSpotlight').innerHTML = '';
            document.getElementById('paragraph').innerHTML = '';
            document.getElementById('definition').innerHTML = '';
            document.getElementById('definition:').innerHTML = '';
            document.getElementById('score').innerHTML = '';
            document.getElementById('mistakes').innerHTML = '';
            document.getElementById('wrong-guesses').innerHTML = 'Your Score is';
            document.getElementById('your-score').innerHTML = finalScore;
            document.getElementById('hangmanPic').src="./hangmanimages/.jpg";
            return;
        }
        displayTimeLeft(secondsleft);
    }, 1000);
}

//Displays how much time is left
function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display =  `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;

}
//How the player will start the timer
function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
    generateButtons();
    randomWord();
    guessedWord();
    getDefintion();
}



buttons.forEach(button => button.addEventListener('click', startTimer));