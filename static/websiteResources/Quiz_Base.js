const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const scoreElement = document.getElementById('score')
const scoreBrdElement = document.getElementById('score-brd')
const answerButtonsElement = document.getElementById('answer-buttons')
const endContainerElement = document.getElementById('end-container')

let shuffledQuestions, currentQuestionIndex
let scoreIndex

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

function startGame() {
    console.log('Started')
    endContainerElement.classList.add('hide')
    scoreIndex = 0
    startButton.classList.add('hide')
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerElement.classList.remove('hide')
    scoreElement.classList.remove('hide')
    scoreBrdElement.classList.remove('hide')
    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    questionElement.innerText = question.question
    scoreElement.innerText = scoreIndex
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click',selectAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(
            answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    console.log('1')
    checkAnswer(selectedButton,correct)
    setStatusClass(document.body, correct)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })
    if (shuffledQuestions.length > currentQuestionIndex + 1){
        nextButton.classList.remove('hide')
    } else {
        startButton.innerText = 'Restart'
        endContainerElement.classList.remove('hide')
        questionContainerElement.classList.add('hide')
        startButton.classList.remove('hide')
    }
}

function checkAnswer(answer,correct){
    console.log('2')
    if (correct) {
        scoreIndex++
        console.log('3')
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    if(correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

const questions = [
    {
        question: 'What is 2 + 2?',
        answers: [
            { text: '4', correct: true },
            { text: '22', correct: false }
        ]
    },
        {
        question: 'What is 4 * 2?',
        answers: [
            { text: '8', correct: true },
            { text: '16', correct: false },
            { text: '64', correct: false },
            { text: '102', correct: false }
        ]
    },
            {
        question: 'What is 9 + 10?',
        answers: [
            { text: '21', correct: true },
            { text: '14', correct: false },
            { text: '19', correct: false },
            { text: '6', correct: false }
        ]
    }
]
