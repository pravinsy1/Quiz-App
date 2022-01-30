// import { questions } from "./script.js";
const startQuizBtn = document.querySelector(".start-quiz");
const timeText = document.querySelector(".time");
const startQuizModel = document.querySelector(".start-quiz-model-container");
const questionContainer = document.querySelector(".question-container");
const userScoreModel = document.querySelector(".complete-question-container");
const submitUserScore = document.querySelector("form");
const highScoresModel = document.querySelector(".highscores-container");
const highScoresBtn = document.querySelector(".leaderboard");
const userScore = document.querySelector(".user-score");
const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: ["1. numbers and strings", "2. other arrays", "3. booleans", "4. all of the above"],
    answer: "4. all of the above",
  },
  {
    questionText: "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText: "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: ["1. JavaScript", "2. terminal/bash", "3. for loops", "4. console.log"],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. halt", "4. exit"],
    answer: "1. break",
  },
];
let time = 60;
let shuffledQuestions = [];
let questionCounter = 0;
let timeInterval = "";
let highScores = JSON.parse(localStorage.getItem("usersScores")) || [];

// Event Handler
startQuizBtn.addEventListener("click", () => {
  timeText.textContent = `Time:${(time -= 1)}`;
  timeInterval = setInterval(setTimer, 1000);
  shuffledQuestions = questions.sort(() => 0.5 - Math.random());
  setStartQuizModel();
  dispalyQuestions();
});
document.querySelector(".clearHighScoreButton").addEventListener("click", () => {
  localStorage.clear();
  highScores = JSON.parse(localStorage.getItem("usersScores")) || [];
  displayHighScores();
});
document.querySelector(".backButton").addEventListener("click", () => {
  highScoresModel.style.display = "none";
  if (time === 60 && questionCounter === 0) {
    startQuizModel.style.display = "flex";
    resetQuizVlaue();
  } else if (userScore.textContent === "") {
    questionContainer.style.display = "flex";
  } else {
    userScoreModel.style.display = "flex";
  }
});
highScoresBtn.addEventListener("click", () => {
  highScores.sort((a, b) => b.score - a.score);
  showHighScoresModel();
  displayHighScores();
});
const nameWarning = document.createElement("div");
submitUserScore.addEventListener("submit", (e) => {
  e.preventDefault();
  if (submitUserScore.name.value.trim().length === 0) {
    nameWarning.textContent = "*Name Cannot Be Empty";
    nameWarning.classList.add("name-warning");
    nameWarning.style.display = "flex";
    userScoreModel.appendChild(nameWarning);
    return;
  } else {
    nameWarning.style.display = "none";
  }

  const userScore = {
    name: submitUserScore.name.value,
    score: time,
  };
  highScores.push(userScore);
  setUserScore(highScores);
  userScoreModel.style.display = "none";
  startQuizModel.style.display = "flex";
  submitUserScore.name.value = "";
  resetQuizVlaue();
});

questionContainer.addEventListener("click", (e) => {
  const setUserAnswer = document.querySelector(".question-status");
  if (!e.target.closest(".question-answer")) return;
  if (e.target.closest(".question-answer")) {
    [...document.querySelectorAll(".question-answer")].map((elem) => (elem.style.pointerEvents = "none"));
    questionCounter += 1;
    checkUserAnswer(e.target, setUserAnswer);
  }
  questionContainer.disabled = true;
  setTimeout(() => {
    questionContainer.innerHTML = "";
    e.target.disabled = true;
    if (questionCounter === questions.length) {
      quizFinsih();
      clearInterval(timeInterval);
      return;
    }
    dispalyQuestions(questions);
  }, 1000);
});

// Quiz Logic
function setTimer() {
  time -= 1;
  if (time < 1) {
    stopInterval();
    timeText.textContent = `Time:${0}`;
    quizFinsih();
    return;
  }
  timeText.textContent = `Time:${time}`;
}
function stopInterval() {
  clearInterval(timeInterval);
}
function setStartQuizModel() {
  startQuizModel.style.display = "none";
  questionContainer.style.display = "flex";
}
function dispalyQuestions() {
  const qeustion = shuffledQuestions[questionCounter];
  questionContainer.innerHTML = `
  <h2 class="question-name" data-question-number="${questionCounter + 1}">${qeustion.questionText}</h2>
  <li class="question-answer" data-correctAnswer=${qeustion.answer}>${qeustion.options[0]}</li>
  <li class="question-answer" data-correctAnswer=${qeustion.answer}>${qeustion.options[1]}</li>
  <li class="question-answer" data-correctAnswer=${qeustion.answer}>${qeustion.options[2]}</li>
  <li class="question-answer" data-correctAnswer=${qeustion.answer}>${qeustion.options[3]}</li>
  <div class="question-status"></div>
  `;
}
function checkUserAnswer(answer, setUserAnswer) {
  const correctAnswer = answer.dataset.correctanswer.split(".")[0];
  const userAnswer = answer.textContent.split(".")[0];
  setUserAnswer.style.display = "flex";
  if (userAnswer == correctAnswer) {
    setUserAnswer.textContent = "Correct!";
  } else {
    setUserAnswer.textContent = "Incorrect!";
    clearInterval(timeInterval);
    time -= 10;
    if (time < 0) {
      timeText.textContent = `Time:${0}`;
    } else {
      timeText.textContent = `Time:${time}`;
    }
    timeInterval = setInterval(setTimer, 1000);
    return;
  }
}
function quizFinsih() {
  userScore.textContent = `Your final score is ${time < 0 ? 0 : time}.`;
  questionContainer.style.display = "none";
  userScoreModel.style.display = "flex";
}
function setUserScore(score) {
  localStorage.setItem("usersScores", JSON.stringify(score));
}
function resetQuizVlaue() {
  questionCounter = 0;
  time = 60;
  timeText.textContent = "Time:";
  clearInterval(timeInterval);
}
function showHighScoresModel() {
  startQuizModel.style.display = "none";
  questionContainer.style.display = "none";
  userScoreModel.style.display = "none";
  highScoresModel.style.display = "flex";
}
function displayHighScores() {
  const highScoresContainer = document.querySelector(".high-scores-data");
  highScoresContainer.innerHTML = "";
  highScores.length == 0
    ? (highScoresContainer.textContent = "No Scores To Show")
    : highScores.forEach((elem, idx) => {
        highScoresContainer.innerHTML += `
    <li class="score">${idx + 1}. ${elem.name} - ${elem.score}</li>
    `;
      });
}
