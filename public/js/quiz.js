"use strict";

/* ==========================================================
        AASRAA Skillability Centre
        Computer Application Mock Test Portal
        Quiz Module
========================================================== */


/* ==========================================================
        LOGIN PROTECTION
========================================================== */

const currentUser = JSON.parse(

    localStorage.getItem("currentUser")

);

if (!currentUser) {

    alert("Please login first.");

    window.location.href = "/login";

    throw new Error("Student not logged in.");

}


/* ==========================================================
        SUBJECT VALIDATION
========================================================== */

const selectedSubject =

    localStorage.getItem("selectedSubject");

if (!selectedSubject) {

    alert("Please select a subject.");

    window.location.href = "/dashboard";

}


/* ==========================================================
        STUDENT DETAILS
========================================================== */

const studentName =
    document.getElementById("studentName");

const studentId =
    document.getElementById("studentId");

const subjectName =
    document.getElementById("subjectName");

const questionSubject =
    document.getElementById("questionSubject");


/* ==========================================================
        QUESTION AREA
========================================================== */

const questionNumber =
    document.getElementById("questionNumber");

const questionText =
    document.getElementById("questionText");


const optionInputs = [

    document.getElementById("option1"),

    document.getElementById("option2"),

    document.getElementById("option3"),

    document.getElementById("option4")

];


const optionLabels = [

    document.getElementById("label1"),

    document.getElementById("label2"),

    document.getElementById("label3"),

    document.getElementById("label4")

];


/* ==========================================================
        TIMER
========================================================== */

const timer =
    document.getElementById("timer");

const remainingTime =
    document.getElementById("remainingTime");


/* ==========================================================
        PROGRESS
========================================================== */

const answeredCount =
    document.getElementById("answeredCount");

const unansweredCount =
    document.getElementById("unansweredCount");

const modalAnswered =
    document.getElementById("modalAnswered");

const modalUnanswered =
    document.getElementById("modalUnanswered");

const progressBar =
    document.getElementById("progressBar");


/* ==========================================================
        BUTTONS
========================================================== */

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const confirmSubmitBtn =
    document.getElementById("confirmSubmitBtn");

const submitTestBtn =
    document.getElementById("submitTestBtn");

const paletteButtons =
    document.querySelectorAll(".question-btn");


/* ==========================================================
        QUIZ VARIABLES
========================================================== */

let allQuestions = [];

let examQuestions = [];

let answers = [];

let currentQuestion = 0;

let totalQuestions = 20;

let examTime = 600;

let timerInterval = null;


/* ==========================================================
        SHOW STUDENT DETAILS
========================================================== */

studentName.textContent =
    currentUser.fullName;

studentId.textContent =
    currentUser.studentId;

subjectName.textContent =
    selectedSubject.toUpperCase();

questionSubject.textContent =
    selectedSubject.toUpperCase();


/* ==========================================================
        CONSOLE
========================================================== */

console.log("====================================");

console.log("Quiz Engine Started");

console.log("Student :", currentUser.fullName);

console.log("Subject :", selectedSubject);

console.log("====================================");

/* ==========================================================
        SHUFFLE ARRAY
========================================================== */

function shuffleArray(array) {

    const shuffled = [...array];

    for (

        let i = shuffled.length - 1;

        i > 0;

        i--

    ) {

        const j = Math.floor(

            Math.random() * (i + 1)

        );

        [shuffled[i], shuffled[j]] =

            [shuffled[j], shuffled[i]];

    }

    return shuffled;

}

/* ==========================================================
        NEXT BUTTON
========================================================== */

nextBtn.addEventListener("click", () => {

    saveAnswer();

    if (currentQuestion < examQuestions.length - 1) {

        currentQuestion++;

        renderQuestion();

    }

});


/* ==========================================================
        PREVIOUS BUTTON
========================================================== */

previousBtn.addEventListener("click", () => {

    saveAnswer();

    if (currentQuestion > 0) {

        currentQuestion--;

        renderQuestion();

    }

});

/* ==========================================================
        QUESTION PALETTE
========================================================== */

paletteButtons.forEach(button => {

    button.addEventListener("click", () => {

        saveAnswer();

        currentQuestion = Number(

            button.dataset.question

        );

        renderQuestion();

    });

});


/* ==========================================================
        LOAD QUESTIONS
========================================================== */

async function loadQuestions() {

    try {

        const response =

            await fetch("/data/question.json");

        if (!response.ok) {

            throw new Error(

                "Unable to load question.json"

            );

        }

        const questionBank =

            await response.json();

        const subjectKey =

            selectedSubject.toLowerCase();

        if (!questionBank[subjectKey]) {

            throw new Error(

                "Subject not found."

            );

        }

        allQuestions =

            [...questionBank[subjectKey]];

        prepareQuiz();

    }

    catch (error) {

        console.error(error);

        questionText.textContent =

            "Unable to load questions.";

    }

}


/* ==========================================================
        PREPARE QUIZ
========================================================== */

function prepareQuiz() {

    allQuestions =
        shuffleArray(allQuestions);

    examQuestions =
        allQuestions.slice(0, totalQuestions);

    examQuestions =
        examQuestions.map(question => {

            return {

                ...question,

                options:
                    shuffleArray(question.options)

            };

        });

    answers =
        new Array(examQuestions.length).fill(null);

    console.log(

        "Questions Loaded :",

        examQuestions.length

    );

    renderQuestion();

    updateProgress();

    startTimer();

}
/* ==========================================================
        RENDER QUESTION
========================================================== */

function renderQuestion() {

    if (examQuestions.length === 0) {

        return;

    }

    const question =

        examQuestions[currentQuestion];

    /* ==========================
            QUESTION NUMBER
    ========================== */

    questionNumber.textContent =

        `Question ${currentQuestion + 1} of ${examQuestions.length}`;

    /* ==========================
            QUESTION TEXT
    ========================== */

    questionText.textContent =

        question.question;

    /* ==========================
            OPTIONS
    ========================== */

    optionInputs.forEach((input, index) => {

        input.checked = false;

        input.value =

            question.options[index];

        optionLabels[index].textContent =

            question.options[index];

    });
    restoreAnswer();

    updateNavigationButtons();

    updateProgress();


}


/* ==========================================================
        RESTORE ANSWER
========================================================== */

function restoreAnswer() {

    const selectedAnswer =

        answers[currentQuestion];

    if (!selectedAnswer) {

        return;

    }

    optionInputs.forEach(input => {

        if (input.value === selectedAnswer) {

            input.checked = true;

        }

    });

}


/* ==========================================================
        SAVE ANSWER
========================================================== */

function saveAnswer() {

    const selected =

        document.querySelector(
            'input[name="answer"]:checked'
        );

    if (selected) {

        answers[currentQuestion] =

            selected.value;

    }

    else {

        answers[currentQuestion] = null;

    }

}


/* ==========================================================
        UPDATE BUTTONS
========================================================== */

function updateNavigationButtons() {

    previousBtn.disabled =

        currentQuestion === 0;

    nextBtn.disabled =

        currentQuestion ===

        examQuestions.length - 1;

}


/* ==========================================================
        OPTION CLICK
========================================================== */

optionInputs.forEach(input => {

    input.addEventListener("change", () => {

        saveAnswer();

        updateProgress();

    });

});





/* ==========================================================
        UPDATE PROGRESS
========================================================== */

function updateProgress() {

    updateAnsweredCount();

    updateProgressBar();

    updatePalette();

}


/* ==========================================================
        ANSWERED COUNT
========================================================== */

function updateAnsweredCount() {

    const answered =

        answers.filter(answer => answer !== null).length;

    const unanswered =

        examQuestions.length - answered;

    answeredCount.textContent = answered;

    unansweredCount.textContent = unanswered;

    if (modalAnswered) {

        modalAnswered.textContent = answered;

    }

    if (modalUnanswered) {

        modalUnanswered.textContent = unanswered;

    }

}


/* ==========================================================
        PROGRESS BAR
========================================================== */

function updateProgressBar() {

    if (!progressBar) return;

    const answered =

        answers.filter(answer => answer !== null).length;

    const percentage =

        (answered / examQuestions.length) * 100;

    progressBar.style.width =

        percentage + "%";

    progressBar.textContent =
        Math.round(percentage) + "%";

    progressBar.setAttribute(

        "aria-valuetext",

        Math.round(percentage) + "%"

    );

}


/* ==========================================================
        QUESTION PALETTE
========================================================== */

function updatePalette() {

    if (!paletteButtons.length) return;

    paletteButtons.forEach((button, index) => {

        button.classList.remove(

            "btn-primary",

            "btn-success",

            "btn-warning"

        );

        if (index === currentQuestion) {

            button.classList.add("btn-warning");

        }

        else if (answers[index] !== null) {

            button.classList.add("btn-success");

        }

        else {

            button.classList.add("btn-primary");

        }

    });

}
/* ==========================================================
        START TIMER
========================================================== */

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        examTime--;

        updateTimer();

        if (examTime <= 0) {

            clearInterval(timerInterval);

            submitQuiz();

        }

    }, 1000);

}


/* ==========================================================
        UPDATE TIMER
========================================================== */

function updateTimer() {

    const minutes =

        Math.floor(examTime / 60);

    const seconds =

        examTime % 60;

    const displayTime =

        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    timer.textContent = displayTime;

    remainingTime.textContent = displayTime;

    if (examTime <= 60) {

        timer.classList.add("text-danger");

        remainingTime.classList.add("text-danger");

    }

}



/* ==========================================================
        SUBMIT QUIZ
========================================================== */

async function submitQuiz() {

    clearInterval(timerInterval);

    saveAnswer();

    let correct = 0;
    let wrong = 0;
    let attempted = 0;
    let unattempted = 0;

    examQuestions.forEach((question, index) => {

        const selectedAnswer = answers[index];

        if (selectedAnswer === null) {

            unattempted++;

        } else {

            attempted++;

            if (selectedAnswer === question.answer) {

                correct++;

            } else {

                wrong++;

            }

        }

    });

    const percentage =
        Number(
            ((correct / examQuestions.length) * 100).toFixed(2)
        );

    let grade = "";
    let status = "";

    if (percentage >= 90) {

        grade = "A+";
        status = "Pass";

    } else if (percentage >= 80) {

        grade = "A";
        status = "Pass";

    } else if (percentage >= 70) {

        grade = "B";
        status = "Pass";

    } else if (percentage >= 60) {

        grade = "C";
        status = "Pass";

    } else if (percentage >= 40) {

        grade = "D";
        status = "Pass";

    } else {

        grade = "F";
        status = "Fail";

    }

/* =====================================================
        CREATE RESULT OBJECT
===================================================== */

    const result = {

        studentName: currentUser.fullName,

        studentId: currentUser.studentId,

        subject: selectedSubject,

        totalQuestions: examQuestions.length,

        attempted: attempted,

        unattempted: unattempted,

        correct: correct,

        score: correct,

        wrong: wrong,

        percentage: percentage,

        grade: grade,

        status: status,

        timeTaken: 600 - examTime,

        answers: answers,

        questions: examQuestions,

        timeLeft: examTime

    };

    /* =====================================================
            SAVE RESULT TO MONGODB
    ===================================================== */

    try {

        const response = await fetch("/api/results", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(result)

        });

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Result Save Error:",
                data
            );

            alert(
                data.message ||
                "Unable to save quiz result."
            );

            return;

        }

        console.log(
            "Quiz Result Saved Successfully:",
            data
        );

        /* ================================================
                TEMPORARY BROWSER RESULT
        ================================================= */

        localStorage.setItem(
            "quizResult",
            JSON.stringify(result)
        );

        /* ================================================
                GO TO RESULT PAGE
        ================================================= */

        window.location.href = "/result";

    }

    catch (error) {

        console.error(
            "Result Save Error:",
            error
        );

        alert(
            "Unable to connect to server. Result was not saved."
        );

    }

}
/* ==========================================================
        CONFIRM SUBMIT
========================================================== */

if (confirmSubmitBtn) {

    confirmSubmitBtn.addEventListener("click", (event) => {

        event.preventDefault();

        submitQuiz();

    });

}

loadQuestions();