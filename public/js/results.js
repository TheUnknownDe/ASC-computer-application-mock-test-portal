"use strict";

/* ==========================================================
        AASRAA Skillability Centre
        Admin Results Module
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

const totalAttempts =
    document.getElementById("totalAttempts");

const totalPass =
    document.getElementById("totalPass");

const totalFail =
    document.getElementById("totalFail");

const averageScore =
    document.getElementById("averageScore");

const searchInput =
    document.getElementById("searchInput");

const subjectFilter =
    document.getElementById("subjectFilter");

const statusFilter =
    document.getElementById("statusFilter");

const exportBtn =
    document.getElementById("exportBtn");

const dashboardBtn =
    document.getElementById("dashboardBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const resultsTableBody =
    document.getElementById("resultsTableBody");


/* ==========================================================
        MODAL ELEMENTS
========================================================== */

const modalStudentId =
    document.getElementById("modalStudentId");

const modalStudentName =
    document.getElementById("modalStudentName");

const modalSubject =
    document.getElementById("modalSubject");

const modalAttempt =
    document.getElementById("modalAttempt");

const modalTotalQuestions =
    document.getElementById("modalTotalQuestions");

const modalCorrectAnswers =
    document.getElementById("modalCorrectAnswers");

const modalWrongAnswers =
    document.getElementById("modalWrongAnswers");

const modalPercentage =
    document.getElementById("modalPercentage");

const modalStatus =
    document.getElementById("modalStatus");

const modalTimeTaken =
    document.getElementById("modalTimeTaken");

const modalSubmittedAt =
    document.getElementById("modalSubmittedAt");


/* ==========================================================
        LOAD RESULTS
========================================================== */

let results =
    JSON.parse(localStorage.getItem("results")) || [];

results = [...results].reverse();

let filteredResults =
    [...results];
/* ==========================================================
        LOAD ANALYTICS
========================================================== */

function loadAnalytics() {

    totalAttempts.textContent =
        results.length;

    let pass = 0;

    let fail = 0;

    let totalPercentage = 0;

    results.forEach(result => {

        if (result.percentage >= 40) {

            pass++;

        }

        else {

            fail++;

        }

        totalPercentage += result.percentage;

    });

    totalPass.textContent =
        pass;

    totalFail.textContent =
        fail;

    if (results.length === 0) {

        averageScore.textContent = "0%";

    }

    else {

        averageScore.textContent =
            (totalPercentage / results.length).toFixed(1) + "%";

    }

}


/* ==========================================================
        RENDER RESULTS TABLE
========================================================== */

function renderResults(data = filteredResults) {

    resultsTableBody.innerHTML = "";

    if (data.length === 0) {

        resultsTableBody.innerHTML = `

        <tr>

            <td colspan="9"
                class="text-center py-5">

                No Results Found

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((result, index) => {

        const statusClass =

            result.percentage >= 40

                ?

                "status-pass"

                :

                "status-fail";

        const statusText =

            result.percentage >= 40

                ?

                "Pass"

                :

                "Fail";

        resultsTableBody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${result.studentId}</td>

            <td>${result.studentName}</td>

            <td>${result.subject}</td>

            <td>

                ${result.correctAnswers}/${result.totalQuestions}

            </td>

            <td>

                ${result.percentage}%

            </td>

            <td>

                <span class="${statusClass}">

                    ${statusText}

                </span>

            </td>

            <td>

                ${result.date}

            </td>

            <td>

                <button

                    class="action-btn view-btn"

                    onclick="viewResult(${index})">

                    <i class="bi bi-eye-fill"></i>

                </button>

                <button

                    class="action-btn delete-btn"

                    onclick="deleteResult(${index})">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

}
/* ==========================================================
        SEARCH & FILTER
========================================================== */

searchInput.addEventListener("input", filterResults);

subjectFilter.addEventListener("change", filterResults);

statusFilter.addEventListener("change", filterResults);

function filterResults() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();

    const subjectValue =
        subjectFilter.value;

    const statusValue =
        statusFilter.value;

    filteredResults = results.filter(result => {

        const matchSearch =

            result.studentName
                .toLowerCase()
                .includes(searchValue)

            ||

            result.studentId
                .toLowerCase()
                .includes(searchValue)

            ||

            result.subject
                .toLowerCase()
                .includes(searchValue);

        const matchSubject =

            subjectValue === "All"

            ||

            result.subject === subjectValue;

        const matchStatus =

            statusValue === "All"

            ||

            (statusValue === "Pass" && result.percentage >= 40)

            ||

            (statusValue === "Fail" && result.percentage < 40);

        return (

            matchSearch &&

            matchSubject &&

            matchStatus

        );

    });

    renderResults();

}


/* ==========================================================
        VIEW RESULT
========================================================== */

function viewResult(index) {

    const result =
        filteredResults[index];

    modalStudentId.textContent =
        result.studentId;

    modalStudentName.textContent =
        result.studentName;

    modalSubject.textContent =
        result.subject;

    modalAttempt.textContent =
        "-";

    modalTotalQuestions.textContent =
        result.totalQuestions;

    modalCorrectAnswers.textContent =
        result.correctAnswers;

    modalWrongAnswers.textContent =
        result.wrongAnswers;

    modalPercentage.textContent =
        result.percentage + "%";

    modalStatus.textContent =

        result.percentage >= 40

            ?

            "Pass"

            :

            "Fail";

    modalTimeTaken.textContent =
        result.timeTaken;

    modalSubmittedAt.textContent =
        result.date;

    const modal =
        new bootstrap.Modal(

            document.getElementById("resultModal")

        );

    modal.show();

}


/* ==========================================================
        DELETE RESULT
========================================================== */

function deleteResult(index) {

    const result =
        filteredResults[index];

    const confirmDelete =
        confirm(

            `Delete this result?

${result.studentName}

${result.subject}`

        );

    if (!confirmDelete) {

        return;

    }

    results = results.filter(item =>

        !(

            item.studentId === result.studentId &&

            item.subject === result.subject &&

            item.date === result.date &&

            item.score === result.score

        )

    );

    filteredResults =
        [...results];    

    localStorage.setItem(

        "results",

        JSON.stringify(results)

    );

    loadAnalytics();

    filterResults();

    // renderResults();

    alert("Result deleted successfully.");

}


/* ==========================================================
        EXPORT CSV
========================================================== */

exportBtn.addEventListener("click", () => {

    if (results.length === 0) {

        alert("No results available.");

        return;

    }

    let csv =

        "Student ID,Student Name,Subject,Score,Percentage,Status,Date\n";

    results.forEach(result => {

        csv +=

            `${result.studentId},` +

            `${result.studentName},` +

            `${result.subject},` +

            `${result.correctAnswers}/${result.totalQuestions},` +

            `${result.percentage}%,` +

            `${result.percentage >= 40 ? "Pass" : "Fail"},` +

            `${result.date}\n`;

    });

    const blob =
        new Blob([csv], {

            type: "text/csv"

        });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download = "Quiz_Results.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});


/* ==========================================================
        DASHBOARD
========================================================== */

dashboardBtn.addEventListener("click", () => {

    window.location.href = "/admin-dashboard";

});


/* ==========================================================
        LOGOUT
========================================================== */

logoutBtn.addEventListener("click", () => {

    if (confirm("Logout Admin?")) {

        localStorage.removeItem(

            "adminLoggedIn"

        );

        window.location.href = "/admin-login";

    }

});


/* ==========================================================
        INITIALIZE
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadAnalytics();

        renderResults();

    }

);


/* ==========================================================
        CONSOLE
========================================================== */

console.log("====================================");

console.log("Results Module Loaded Successfully");

console.log("====================================");