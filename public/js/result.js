// ======================================
// Result Page
// ======================================

// ======================================
// Logged In Student
// ======================================

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));


// ======================================
// Check Login
// ======================================

if (!currentUser) {

    alert("Please login first.");

    window.location.href = "/login";

    throw new Error("Student not logged in.");

}


// ======================================
// Quiz Result
// ======================================

const quizResult =
    JSON.parse(localStorage.getItem("quizResult"));


// ======================================
// Check Quiz Result
// ======================================

if (!quizResult) {

    alert("No quiz result found.");

    window.location.href = "/dashboard";

    throw new Error("No quiz result found.");

}


// ======================================
// Verify Result Belongs To Current Student
// ======================================

if (quizResult.studentId !== currentUser.studentId) {

    localStorage.removeItem("quizResult");

    alert("This result does not belong to the logged-in student.");

    window.location.href = "/dashboard";

    throw new Error(
        "Quiz result belongs to another student."
    );

}

// ======================================
// Student Details
// ======================================

document.getElementById("studentName").textContent =
    currentUser.fullName;

document.getElementById("studentId").textContent =
    currentUser.studentId;

// ======================================
// Quiz Details
// ======================================

document.getElementById("subjectName").textContent =
    quizResult.subject;

document.getElementById("totalQuestions").textContent =
    quizResult.totalQuestions;

document.getElementById("correctAnswers").textContent =
    quizResult.correct;

document.getElementById("wrongAnswers").textContent =
    quizResult.wrong;

document.getElementById("finalScore").textContent =
    `${quizResult.score} / ${quizResult.totalQuestions}`;

document.getElementById("percentage").textContent =
    `${quizResult.percentage}%`;

document.getElementById("timeTaken").textContent =
    `${Math.floor(quizResult.timeTaken / 60)}m ${quizResult.timeTaken % 60}s`;

// ======================================
// Result Status
// ======================================

const resultStatus = document.getElementById("resultStatus");

const grade = document.getElementById("grade");

const progressBar = document.getElementById("progressBar");

const performanceMessage =
    document.getElementById("performanceMessage");

let status = quizResult.status;

let studentGrade = quizResult.grade;

let message = "";

// ======================================
// Pass / Fail
// ======================================

// Remove old classes (Professional Practice)
resultStatus.classList.remove("pass", "fail");

if (quizResult.percentage >= 40) {

    status = "Pass";

    resultStatus.textContent = status;

    resultStatus.classList.add("pass");

} else {

    status = "Fail";

    resultStatus.textContent = status;

    resultStatus.classList.add("fail");

}

// ======================================
// Grade
// ======================================

if (quizResult.percentage >= 90) {

    studentGrade = "A+";

    message = "Outstanding Performance!";

}

else if (quizResult.percentage >= 80) {

    studentGrade = "A";

    message = "Excellent Work!";

}

else if (quizResult.percentage >= 70) {

    studentGrade = "B";

    message = "Very Good!";

}

else if (quizResult.percentage >= 60) {

    studentGrade = "C";

    message = "Good Job!";

}

else if (quizResult.percentage >= 40) {

    studentGrade = "D";

    message = "Keep Practicing!";

}

else {

    studentGrade = "F";

    message = "Don't Give Up. Try Again!";

}

grade.textContent = studentGrade;

performanceMessage.textContent = message;

// ======================================
// Progress Bar
// ======================================

progressBar.style.width =
    `${quizResult.percentage}%`;

progressBar.textContent =
    `${quizResult.percentage}%`;

progressBar.setAttribute(
    "aria-valuenow",
    quizResult.percentage
);

// ======================================
// Buttons
// ======================================

const dashboardBtn =
    document.getElementById("dashboardBtn");

const dashboardBtn2 =
    document.getElementById("dashboardBtn2");

const retryQuizBtn =
    document.getElementById("retryQuizBtn");

const viewHistoryBtn =
    document.getElementById("viewHistoryBtn");

const printResultBtn =
    document.getElementById("printResultBtn");

// ======================================
// Dashboard
// ======================================

dashboardBtn.addEventListener("click", () => {

    window.location.href = "/dashboard";

});

dashboardBtn2.addEventListener("click", () => {

    window.location.href = "/dashboard";

});

// ======================================
// Retry Quiz
// ======================================

retryQuizBtn.addEventListener("click", () => {

    localStorage.setItem(
        "selectedSubject",
        quizResult.subject
    );

    window.location.href = "/quiz";
});

// ======================================
// View History
// ======================================

viewHistoryBtn.addEventListener("click", () => {

    window.location.href = "/history";

});

// ======================================
// Print Result
// ======================================

printResultBtn.addEventListener("click", () => {

    window.print();

});// ======================================
// Initialize Result Page
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Result Page Loaded Successfully.");

});// ======================================
// Future Ready Functions
// ======================================

// Leaderboard

function updateLeaderboard() {

    // Future Update

}

// Certificate

function generateCertificate() {

    // Future Update

}



// ======================================
// Page Safety Check
// ======================================

window.addEventListener("beforeunload", () => {

    console.log("Leaving Result Page...");

});

// ======================================
// Result Module Loaded
// ======================================


console.log("Result Module Loaded Successfully.");