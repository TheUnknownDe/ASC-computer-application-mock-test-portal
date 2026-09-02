"use strict";

/* ==========================================================
        AASRAA Skillability Centre
        Questions Module
========================================================== */

/* ==========================================================
        ADMIN LOGIN CHECK
========================================================== */

const adminLoggedIn =
localStorage.getItem("adminLoggedIn");

if (adminLoggedIn !== "true") {

    alert("Please login first.");

    window.location.href = "/admin-login";

}
/* ==========================================================
        DOM ELEMENTS
========================================================== */

const adminName =
document.getElementById("adminName");

const dashboardBtn =
document.getElementById("dashboardBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const totalQuestions =
document.getElementById("totalQuestions");

const pythonQuestions =
document.getElementById("pythonQuestions");

const htmlQuestions =
document.getElementById("htmlQuestions");

const excelQuestions =
document.getElementById("excelQuestions");

const searchInput =
document.getElementById("searchInput");

const subjectFilter =
document.getElementById("subjectFilter");

const addQuestionBtn =
document.getElementById("addQuestionBtn");

const questionsTableBody =
document.getElementById("questionsTableBody");
/* ==========================================================
        MODAL ELEMENTS
========================================================== */

const modalTitle =
document.getElementById("modalTitle");

const questionForm =
document.getElementById("questionForm");

const questionIndex =
document.getElementById("questionIndex");

const subject =
document.getElementById("subject");

const question =
document.getElementById("question");

const optionA =
document.getElementById("optionA");

const optionB =
document.getElementById("optionB");

const optionC =
document.getElementById("optionC");

const optionD =
document.getElementById("optionD");

const correctAnswer =
document.getElementById("correctAnswer");

const saveQuestionBtn =
document.getElementById("saveQuestionBtn");
/* ==========================================================
        LOAD QUESTIONS
========================================================== */

let questions = JSON.parse(

    localStorage.getItem("questions")

) || [];

let filteredQuestions = [...questions];
/* ==========================================================
        LOAD ANALYTICS
========================================================== */

function loadAnalytics() {

    totalQuestions.textContent =
    questions.length;

    pythonQuestions.textContent =
    questions.filter(question =>

        question.subject === "Python"

    ).length;

    htmlQuestions.textContent =
    questions.filter(question =>

        question.subject === "HTML"

    ).length;

    excelQuestions.textContent =
    questions.filter(question =>

        question.subject === "Excel"

    ).length;

}
/* ==========================================================
        RENDER QUESTIONS TABLE
========================================================== */

function renderQuestions(

    data = filteredQuestions

) {

    questionsTableBody.innerHTML = "";

    if (data.length === 0) {

        questionsTableBody.innerHTML = `

        <tr>

            <td colspan="9"
                class="text-center py-5">

                No Questions Found

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((question, index) => {

        questionsTableBody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${question.subject}</td>

            <td>${question.question}</td>

            <td>${question.optionA}</td>

            <td>${question.optionB}</td>

            <td>${question.optionC}</td>

            <td>${question.optionD}</td>

            <td>${question.correctAnswer}</td>

            <td>

                <button
                    class="btn btn-sm btn-primary"
                    onclick="editQuestion(${index})">

                    <i class="bi bi-pencil-fill"></i>

                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteQuestion(${index})">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

}
/* ==========================================================
        INITIALIZE PAGE
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        adminName.textContent =
        "Administrator";

        loadAnalytics();

        renderQuestions();

    }

);