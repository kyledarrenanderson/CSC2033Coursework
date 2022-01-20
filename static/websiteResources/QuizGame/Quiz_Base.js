/**
 * Quiz game code
 *
 * In comparison to the other games code, mine does not work.
 * It can't read the main question files and so I had to make my own
 * and I'm pretty sure I know why, but a fix for it would have broken alot
 * of code.
 *
 * @author Elvis Edward Robinson
 * @version 1.2
 * @since 06-01-2022
 */

//Main elements drawn in from the html page to be used.
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const endButton = document.getElementById('end-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const scoreElement = document.getElementById('score');
const scoreBrdElement = document.getElementById('score-brd');
const diffBrdElement = document.getElementById('difficulty');
const diffElement = document.getElementById('diff');
const answerButtonsElement = document.getElementById('answer-buttons');
const endContainerElement = document.getElementById('end-container');
const businessElement = document.getElementById('BusinessIntel');
const softwareElement = document.getElementById('SoftwareTest');
const technicalElement = document.getElementById('TechOperations');

//Variables required in code
let shuffledQuestions, currentQuestionIndex, scoreIndex;

main();

//Main function to hold initialisations and game start
function main() {
    scoreElement.classList.add('hide');
    scoreBrdElement.classList.add('hide');
    startButton.classList.add('hide');
    endContainerElement.classList.add('hide');
    endButton.classList.add('hide');
    businessElement.classList.remove('hide');
    softwareElement.classList.remove('hide');
    technicalElement.classList.remove('hide');
    businessElement.addEventListener('click', startGameB);
    softwareElement.addEventListener('click', startGameS);
    technicalElement.addEventListener('click', startGameT);
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
}

//Three start functions dependent on question type
function startGameB(){
    console.log('Started B');
    endContainerElement.classList.add('hide');
    scoreIndex = 0;
    startButton.classList.add('hide');
    businessElement.classList.add('hide');
    softwareElement.classList.add('hide');
    technicalElement.classList.add('hide');
    shuffledQuestions = businessQuestions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    scoreElement.classList.remove('hide');
    scoreBrdElement.classList.remove('hide');
    diffBrdElement.classList.remove('hide');
    diffElement.classList.remove('hide');
    setNextQuestion();
}
function startGameS(){
    console.log('Started S');
    endContainerElement.classList.add('hide');
    scoreIndex = 0;
    startButton.classList.add('hide');
    businessElement.classList.add('hide');
    softwareElement.classList.add('hide');
    technicalElement.classList.add('hide');
    shuffledQuestions = softwareQuestions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    scoreElement.classList.remove('hide');
    scoreBrdElement.classList.remove('hide');
    diffBrdElement.classList.remove('hide');
    diffElement.classList.remove('hide');
    setNextQuestion();
}
function startGameT(){
    console.log('Started T');
    endContainerElement.classList.add('hide');
    scoreIndex = 0;
    startButton.classList.add('hide');
    businessElement.classList.add('hide');
    softwareElement.classList.add('hide');
    technicalElement.classList.add('hide');
    shuffledQuestions = technicalQuestions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    scoreElement.classList.remove('hide');
    scoreBrdElement.classList.remove('hide');
    diffBrdElement.classList.remove('hide');
    diffElement.classList.remove('hide');
    setNextQuestion();
}

//End game function to display the end screen
function endGame(){
    console.log('Ended');
    endContainerElement.classList.remove('hide');
    questionContainerElement.classList.add('hide');
    diffElement.classList.add('hide');
    diffBrdElement.classList.add('hide');
    startButton.classList.remove('hide');
    endButton.classList.add('hide');
    startButton.innerText = 'Restart';
    scoreElement.innerHTML = scoreIndex;
    startButton.addEventListener('click', main);

    const request = new XMLHttpRequest();
    let scoreData = {
        'score' : String(scoreIndex),
        'game' : 'Quiz'
    }
    request.open('POST','processScore');
    request.send(JSON.stringify(scoreData));
    window.location.href = "leaderboard";
}

//Function used to reset and call the next question
function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

//Function display the question and answer option
function showQuestion(question) {
    questionElement.innerText = question.question;
    diffElement.innerText = question.difficulty;
    scoreElement.innerText = scoreIndex;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click',selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

//Function that resets the answers for the next question
function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(
            answerButtonsElement.firstChild);
    }
}

//Function used to select the answer
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    checkAnswer(selectedButton,correct);
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    if (shuffledQuestions.length > currentQuestionIndex + 1){
        nextButton.classList.remove('hide');
    } else {
        endButton.classList.remove('hide');
        endButton.addEventListener('click', endGame);
    }
}

//Function that checks if selected answer is right and then increments the score
function checkAnswer(answer,correct){
    if (correct) {
        scoreIndex+=100;
    }
}

//Function that changes the class dependent on answer correctness
function setStatusClass(element, correct) {
    clearStatusClass(element);
    if(correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

//Function that clears the classes between questions
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

//Question lists
const businessQuestions = [
    {
        question: 'A Business Intelligence question',
        difficulty: 'easy',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'The correct answer',correct:true},
            {text:'A confusing answer',correct:false}
        ]
    },
    {
        question: 'Another Business Intelligence question',
        difficulty: 'easy',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false},
            {text:'The correct answer',correct:true}
        ]
    },
        {
        question: 'Another different Business Intelligence question',
        difficulty: 'normal',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'The correct answer',correct:true},
            {text:'A confusing answer',correct:false}
        ]
    },
        {
        question: 'Here is a Business Intelligence question',
        difficulty: 'normal',
        answers : [
            {text:'The correct answer',correct:true},
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false}
        ]
    },
        {
        question: 'A interesting Business Intelligence question',
        difficulty: 'hard',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false},
            {text:'The correct answer',correct:true},
        ]
    },
        {
        question: 'A hard Business Intelligence question',
        difficulty: 'hard',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'The correct answer',correct:true},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false}
        ]
    }
];

const softwareQuestions = [
    {
        question: 'A Software Testing question',
        difficulty: 'easy',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'The correct answer',correct:true},
            {text:'A confusing answer',correct:false}
        ]
    },
    {
        question: 'Another Software Testing question',
        difficulty: 'easy',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false},
            {text:'The correct answer',correct:true}
        ]
    },
        {
        question: 'Another different Software Testing question',
        difficulty: 'normal',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'The correct answer',correct:true},
            {text:'A confusing answer',correct:false}
        ]
    },
        {
        question: 'Here is a Software Testing question',
        difficulty: 'normal',
        answers : [
            {text:'The correct answer',correct:true},
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false}
        ]
    },
        {
        question: 'A interesting Software Testing question',
        difficulty: 'hard',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false},
            {text:'The correct answer',correct:true},
        ]
    },
        {
        question: 'A hard Software Testing question',
        difficulty: 'hard',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'The correct answer',correct:true},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false}
        ]
    }
];

const technicalQuestions = [
    {
        question: 'A Technical Operations question',
        difficulty: 'easy',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'The correct answer',correct:true},
            {text:'A confusing answer',correct:false}
        ]
    },
    {
        question: 'Another Technical Operations question',
        difficulty: 'easy',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false},
            {text:'The correct answer',correct:true}
        ]
    },
        {
        question: 'Another different Technical Operations question',
        difficulty: 'normal',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'The correct answer',correct:true},
            {text:'A confusing answer',correct:false}
        ]
    },
        {
        question: 'Here is a Technical Operations question',
        difficulty: 'normal',
        answers : [
            {text:'The correct answer',correct:true},
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false}
        ]
    },
        {
        question: 'A interesting Technical Operations question',
        difficulty: 'hard',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false},
            {text:'The correct answer',correct:true},
        ]
    },
        {
        question: 'A hard Technical Operations question',
        difficulty: 'hard',
        answers : [
            {text:'An easy answer',correct:false},
            {text:'The correct answer',correct:true},
            {text:'A wrong answer',correct:false},
            {text:'A confusing answer',correct:false}
        ]
    }
];
