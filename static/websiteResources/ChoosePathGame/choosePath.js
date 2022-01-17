let currentQuestionButton
let totalQuestionCount = 24
let easyQuestions = 8
let mediumQuestions = 16
let hardQuestions = 24
let answers = []
let questions = []
let questionBlockHeight = 100
let questionBlockWidth = 300
let questionBlockX = 618
let questionBlockY = 600
let mydata = JSON.parse(data)
let questionNumber = 0
let currentQuestion = 0
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

function generateEasyQuestionAnswers(questionNumber) {
    answers[0] = mydata[questionNumber].answer
    let i = 1
    while(i < 4){
        randomAnswerNumber = Math.floor(Math.random() * totalQuestionCount)
        randomAnswer = mydata[randomAnswerNumber].answer
        if(randomAnswer !== mydata[0].answer && search(answers,randomAnswer) === 0 && randomAnswerNumber < easyQuestions) {
            answers[i] = randomAnswer
            i += 1
        }
    }
    randomiseAnswerOrder(answers)
    console.log(answers)
}

function generateMediumQuestionAnswers(questionNumber) {
    answers[0] = mydata[questionNumber].answer
    let i = 1
    while(i < 4){
        randomAnswerNumber = Math.floor(Math.random() * totalQuestionCount)
        randomAnswer = mydata[randomAnswerNumber].answer
        if(randomAnswer !== mydata[0].answer && search(answers,randomAnswer) === 0 && randomAnswerNumber < mediumQuestions && randomAnswerNumber > easyQuestions) {
            answers[i] = randomAnswer
            i += 1
        }
    }
    randomiseAnswerOrder(answers)
    console.log(answers)
}

function generateHardQuestionAnswers(questionNumber) {
    answers[0] = mydata[questionNumber].answer
    let i = 1
    while(i < 4){
        randomAnswerNumber = Math.floor(Math.random() * totalQuestionCount)
        randomAnswer = mydata[randomAnswerNumber].answer
        if(randomAnswer !== mydata[0].answer && search(answers,randomAnswer) === 0 && randomAnswerNumber < hardQuestions && randomAnswerNumber > mediumQuestions) {
            answers[i] = randomAnswer
            i += 1
        }
    }
    randomiseAnswerOrder(answers)
    console.log(answers)
}

function search(array, key){
    for(let i = 0; i < array.length; i++){
        if(array[i] === key){
            return i
        }
    }
    return 0
}

function randomiseAnswerOrder(answers) {
    var currentIndex = answers.length,  randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [answers[currentIndex], answers[randomIndex]] = [answers[randomIndex], answers[currentIndex]];
    }

    return answers;
}

function selectQuestion(questionNumber){
    if(mydata[questionNumber].Difficulty === "Easy") {
        generateEasyQuestionAnswers(questionNumber)
    }
    if(mydata[questionNumber].Difficulty === "Normal") {
        generateMediumQuestionAnswers(questionNumber)
    }
    if(mydata[questionNumber].Difficulty === "Hard") {
        generateHardQuestionAnswers(questionNumber)
    }

}

function generateQuestions() {
    let i = 0
    while(i < 16) {
        nextQuestion = mydata[Math.floor(Math.random()*totalQuestionCount)]
        if(search(questions, nextQuestion) === 0) {
            questions[i] = nextQuestion
            i += 1
        }
    }
    console.log(questions)
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type === "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function questionAnswer(currentQuestion, answers) {
    //change to variable depending which answer was clicked
    let chosenAnswer = answers[0]
    if(chosenAnswer === mydata){
    }
}

function startGame() {
    currentQuestionButton = new component(questionBlockWidth, questionBlockHeight, "/static/websiteResources/ChoosePathGame/images/questionBlock.png", questionBlockX, questionBlockY, "image");
    background = new component(1536, 800, "/static/websiteResources/ChoosePathGame/images/background.png", 0, 0, "image");
    updateGameArea()
}

function updateGameArea() {
    background.update();
    currentQuestionButton.update();
    requestAnimationFrame(updateGameArea)
}

function instructions () {
    instructionsBackground = new component(1536, 800, "/static/websiteResources/ChoosePathGame/images/instructionsBackground.png", 0, 0, "image");
    instructionsText = new component(1200, 500, "/static/websiteResources/ChoosePathGame/images/instructionsText.png", 168, 150, "image");
    instructionsBackButton = new component(200, 75, "/static/websiteResources/ChoosePathGame/images/back.png", 668, 675, "image")
    instructionsBackground.update()
    instructionsText.update()
    instructionsBackButton.update()
    document.onclick = function () {
        var rect = canvas.getBoundingClientRect();
        var cursor = window.event;
        var mouseY = cursor.clientY - rect.top;
        var mouseX = cursor.clientX - rect.left;
        if (mouseX > 668 && mouseX < 868 && mouseY > 675 && mouseY < 750) {
            titleScreen()
        }
    }
    requestAnimationFrame(instructions)
}
function questionAnswerScreen() {
    background = new component(1536, 800, "/static/websiteResources/ChoosePathGame/images/background.png", 0, 0, "image");
    questionScreenBlock = new component(800,200,"/static/websiteResources/ChoosePathGame/images/questionBlock.png", 336,200,"image");
    answerBlockOne = new component(300,100,"/static/websiteResources/ChoosePathGame/images/questionBlock.png", 400,500,"image");
    answerBlockTwo = new component(300,100,"/static/websiteResources/ChoosePathGame/images/questionBlock.png", 750,500,"image");
    answerBlockThree = new component(300,100,"/static/websiteResources/ChoosePathGame/images/questionBlock.png", 400,650,"image");
    answerBlockFour = new component(300,100,"/static/websiteResources/ChoosePathGame/images/questionBlock.png", 750,650,"image");
    background.update();
    questionScreenBlock.update();
    answerBlockOne.update();
    answerBlockTwo.update();
    answerBlockThree.update();
    answerBlockFour.update();
    ctx.font = "100px serif";
    generateQuestionAnswers()
    requestAnimationFrame(questionAnswerScreen)
}
function titleScreen() {
    titleScreenBackground = new component(1536, 800, "/static/websiteResources/ChoosePathGame/images/titleScreenBackground.png", 0, 0, "image");
    titleScreenStartButton = new component(300,100, "/static/websiteResources/ChoosePathGame/images/startButton.png",618, 300, "image");
    titleScreenInstructions = new component(300,100, "/static/websiteResources/ChoosePathGame/images/instructions.png",618, 450, "image");
    titleScreenBackground.update();
    titleScreenStartButton.update();
    titleScreenInstructions.update();
    document.onclick = function() {
        var rect = canvas.getBoundingClientRect();
        var cursor = window.event;
        var mouseY = cursor.clientY - rect.top;
        var mouseX = cursor.clientX - rect.left;
        if (mouseX > 618 && mouseX < 918 && mouseY > 300 && mouseY < 400) {
            startGame()
        }
        else if (mouseX > 618 && mouseX < 918 && mouseY > 450 && mouseY < 550){
            instructions()
        }
    }
    requestAnimationFrame(titleScreen)
}