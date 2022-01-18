//Word and Defintion list
let randomWords = new Map([
        ['requirement_analysis', 'What is the first phase of Software Testing Life Cycle(STLC)?'],
        ['manual_testing', 'Which type of software testing can be done|without programming knowledge?'],
        ['test_tool_selection', 'What is followed on first stage in automation testing?'],
        ['user_requirements', 'What acceptance test is based on?'],
        ['white_box_testing', 'Which testing approach known as “structural testing”?'],
        ['agile', 'In which SDLC methodology it is easy to change project requirements?'],
        ['sdlc', 'V-model is a model of ---?'],
        ['environment_setup', 'What is the 3rd step of STLC?'],
        ['bugs', 'What are the software mistakes that occurs during in the coding phase?'],
        ['unit_testing', 'Which testing strategy helps developers to know if the individual unit of the code is working properly?'],
        ['test_environment_setup', 'programming language'],
        ['waterfall_model', 'In which sequential Software Development Life Cycle(SDLC) model testing phase starts only after implementation of the system is done?'],
        ['non_functional_testing', 'Which type of testing’s purpose is to test the reading speed of the software system?'],
        ['requirement_analysis', 'At which stage of STLC, requirements are clarified with stakeholders?'],
        ['grey_box_testing', 'A testing technique to test the application with partial knowledge of the internal workings.'],
        ['integration_testing', 'A level of testing mainly used to test the data flow from one module to other module.'],
        ['endurance_testing', 'A type of software testing method where developers test the system performance under certain load conditions over an extensive period.'],
        ['black_box_testing', 'Which technique is applied for usability testing?'],
        ['automation_testing', 'Which testing type offers better application with less effort?'],
        ['static_testing', 'A type of software testing method which is used to|check the application without executing the code.'],
        ['decision_table_testing', 'A black box testing technique that uses a systematic approach where the various input combinations and their following system behaviour are captured in a tabular form.'],
        ['error_guessing_technique', 'A testing technique in which there is no method for identifying the error and it is based on the experience of the test analyst, where the developer uses their experience to guess the problematic areas of the software.'],
        ['security_testing', 'A type of software testing that is intended to discover the weaknesses,|flaws of a software application as well as protect data.'],
        ['acceptance_testing', 'In this type of software testing, users and customers determine whether the software is conforming specified requirements or not.", "answer'],
        ['gui_testing_tool', 'This type of software tool is used to test the user interface of the application and loopholes can be identified quickly with using this tool rather than testing manually.'],
        ['cross_browser_testing_tool', 'A type of non-functional testing tool that enables to compare|a web application in the various web browser platforms.'],
        ['unit_testing_tool', 'A type of testing tool which helps the programmers to|improve their code. Thus, it reduces the time spent on coding.'],
        ['performance_testing_tool', 'This type of testing tool is used to check the software application’s load, stability and scalability.'],
        ['mutation_testing', 'A white box testing type where developers insert errors purposely into the program to verify whether the existing test case can detect the error or not.']
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
    let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz_'.split('').map(letter => `
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