let quizData = [];
let currentQuestion = 0;
let score = 0;
let answeredQuestions = {};

// Screen elements
const startScreen = document.querySelector(".start-container");
const loadingScreen = document.querySelector(".loading-container");
const quizScreen = document.querySelector(".quiz-container");
const endScreen = document.querySelector(".end-container");
const scoreDisplay = document.querySelector(".score-display");

// Buttons
document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("restartBtn").addEventListener("click", restartQuiz);
document.getElementById("submitBtn").addEventListener("click", checkAnswer);
document.getElementById("nextBtn").addEventListener("click", nextQuestion);
document.getElementById("prevBtn").addEventListener("click", prevQuestion);

function startQuiz() {
    startScreen.style.display = "none";
    loadingScreen.style.display = "block";

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            quizData = data;
            loadingScreen.style.display = "none";
            quizScreen.style.display = "block";
            scoreDisplay.style.display = "block";
            loadQuestion();
        })
        .catch(error => {
            console.error("Error loading quiz data:", error);
            loadingScreen.innerHTML = "<p>Error loading quiz. Please try again.</p>";
        });
}

function loadQuestion() {
    const questionData = quizData[currentQuestion];
    document.getElementById("question").innerText = questionData.question;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    document.getElementById("feedback").innerHTML = "";

    ["A", "B", "C", "D"].forEach(opt => {
        if (questionData[opt]) {
            const isChecked = answeredQuestions[currentQuestion] && answeredQuestions[currentQuestion].selected === opt;
            optionsContainer.innerHTML += `
                <label>
                    <input type="radio" name="answer" value="${opt}" ${isChecked ? "checked" : ""}> ${questionData[opt]}
                </label>`;
        }
    });
}

function checkAnswer() {
    const questionData = quizData[currentQuestion];
    const selected = document.querySelector('input[name="answer"]:checked');
    const feedbackEl = document.getElementById("feedback");

    if (!selected) {
        feedbackEl.innerHTML = `<span class="wrong">Please select an answer!</span>`;
        return;
    }

    answeredQuestions[currentQuestion] = {
        selected: selected.value,
        correct: selected.value === questionData.answer
    };

    if (selected.value === questionData.answer) {
        if (!answeredQuestions[currentQuestion].counted) {
            score++;
            answeredQuestions[currentQuestion].counted = true;
        }
        feedbackEl.innerHTML = `<span class="correct">✅ Correct!</span>`;
    } else {
        if (answeredQuestions[currentQuestion].counted) {
            score--;
            answeredQuestions[currentQuestion].counted = false;
        }
        feedbackEl.innerHTML = `<span class="wrong">❌ Wrong! Correct: ${questionData[questionData.answer]}</span>`;
    }

    updateLiveScore();
}

function updateLiveScore() {
    document.getElementById("liveScore").innerText = score;
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        endQuiz();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function endQuiz() {
    quizScreen.style.display = "none";
    endScreen.style.display = "block";
    document.getElementById("finalScore").innerText = score;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answeredQuestions = {};
    scoreDisplay.style.display = "none";
    endScreen.style.display = "none";
    startScreen.style.display = "block";
}
