/**
 * Hangman game code
 *
 * @author Jack Down
 * @version 1.0
 * @since 08-01-2022
 */

//Word and Defintion list
let randomWords = new Map([
        ['spreadsheets', 'A tool for visualising of simple tabular data via charts and graphs'],
        ['reporting-software', 'This tool is used to report, organize, alter and display data'],
        ['risk-management', 'This stage of business intelligence is about the identification, evaluation of actions might be taken at different times'],
        ['five', 'How many key stages are in business intelligence'],
        ['data-security', 'A process of protecting data from external attacks and data corruption'],
        ['visual-analytics', 'In this process of BI, analysts explore data through visualization'],
        ['data-visualisation', 'A process of interpreting large data sets into graphs'],
        ['dashboards', 'A management reporting tool to measure how well the organization company is performing'],
        ['analytics', 'The discovery, interpretation and communication of meaningful patterns in data'],
        ['metadata', 'A set of data that gives information about some data'],
        ['application-designer', 'A BI role who is responsible for designing the initial reporting templates and dashboards in the front-end applications'],
        ['database-management-system', 'A system that enables users to create, read, update and delete data in a database'],
        ['data-modelling', 'A process of defining, analysing and structuring data within data'],
        ['index', 'A data structure that stores values for a specific column in a table'],
        ['snowflake-schema', 'An arrangement of tables in a database such that the model resembles a snowflake shape'],
        ['front-end', 'This portion of a program usually interfaces directly with the end user'],
        ['data-warehouse', 'A large store of data accumulated from a wide range of sources that can be processed within a company'],
        ['database-administrator', 'A role that is responsible for directing a database and maintaining the data safe'],
        ['star-schema', 'A style of data mart schema and most widely used approach to develop data warehouses'],
        ['online-analytical_processing', 'A process that organizes large business databases and supports complex analysis'],
        ['olap-cube', 'A way of storing data in a multidimensional form, generally for reporting purposes'],
        ['full-load', 'A method of reading and updating all records in a data source during warehouse loading. It is one of the two techniques of loading data'],
        ['scoreboard', 'A graphical representation of the progress over time of users, toward some specified goal and highlighting them'],
        ['slowly-changing-dimensions', 'It is a term that refers data dimensions that can change slowly and unpredictably rather than on a static or fixed schedule'],
        ['table-relations', 'It is a term that refers one or more fields in a database table that contain same value in a related table']
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
    let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz-'.split('').map(letter => `
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
    document.getElementById('hangmanPic').src = '../static/websiteResources/HangManGame/hangmanimages/' + mistakes + '.jpg';
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
    document.getElementById('hangmanPic').src = '../static/websiteResources/HangManGame/hangmanimages/0.jpg';

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
    document.getElementById('hangmanPic').src = '../static/websiteResources/HangManGame/hangmanimages/0.jpg';

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

            const request = new XMLHttpRequest();
            let scoreData = {
                'score': String(finalScore),
                'game': 'HangMan'
            }

            request.open('POST', 'processScore');
            request.send(JSON.stringify(scoreData));
            window.location.href = "leaderboard";

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