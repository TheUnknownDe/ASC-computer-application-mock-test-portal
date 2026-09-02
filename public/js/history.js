"use strict";

/* ==========================================================
        AASRAA Skillability Centre
        Result History Module
        MongoDB Version
========================================================== */


/* ==========================================================
        VARIABLES
========================================================== */

let currentUser = null;

let history = [];


/* ==========================================================
        DOM ELEMENTS
========================================================== */

const studentName =
    document.getElementById("studentName");

const studentId =
    document.getElementById("studentId");

const historyTableBody =
    document.getElementById("historyTableBody");

const totalAttempts =
    document.getElementById("totalAttempts");

const highestScore =
    document.getElementById("highestScore");

const averageScore =
    document.getElementById("averageScore");

const emptyHistory =
    document.getElementById("emptyHistory");

const searchInput =
    document.getElementById("searchInput");

const subjectFilter =
    document.getElementById("subjectFilter");

const dashboardBtn =
    document.getElementById("dashboardBtn");

const startQuizBtn =
    document.getElementById("startQuizBtn");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");

const exportBtn =
    document.getElementById("exportBtn");


/* ==========================================================
        GET CURRENT USER
========================================================== */

async function getCurrentUser() {

    try {

        const response =
            await fetch("/api/me", {

                method: "GET",

                credentials: "include"

            });

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Please login first."
            );

            window.location.href = "/login";

            return false;

        }

        currentUser = data.user;

        studentName.textContent =
            currentUser.fullName;

        studentId.textContent =
            currentUser.studentId;

        return true;

    }

    catch (error) {

        console.error(
            "Get Current User Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

        return false;

    }

}


/* ==========================================================
        LOAD RESULTS FROM MONGODB
========================================================== */

async function loadHistory() {

    try {

        const response =
            await fetch("/api/my-results", {

                method: "GET",

                credentials: "include"

            });

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to load result history."
            );

            return;

        }

        history =
            data.results || [];

        loadAnalytics();

        renderHistoryTable();

    }

    catch (error) {

        console.error(
            "Load History Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}


/* ==========================================================
        LOAD ANALYTICS
========================================================== */

function loadAnalytics() {

    totalAttempts.textContent =
        history.length;

    if (history.length === 0) {

        highestScore.textContent =
            "0%";

        averageScore.textContent =
            "0%";

        emptyHistory.classList.remove(
            "d-none"
        );

        return;

    }

    emptyHistory.classList.add(
        "d-none"
    );


    /* ==========================
            HIGHEST SCORE
    ========================== */

    let highest = 0;

    let totalPercentage = 0;


    history.forEach(item => {

        const percentage =
            Number(item.percentage) || 0;

        if (percentage > highest) {

            highest = percentage;

        }

        totalPercentage +=
            percentage;

    });


    highestScore.textContent =
        highest.toFixed(1) + "%";


    /* ==========================
            AVERAGE SCORE
    ========================== */

    const average =
        totalPercentage / history.length;

    averageScore.textContent =
        average.toFixed(1) + "%";

}


/* ==========================================================
        FORMAT DATE
========================================================== */

function formatDate(dateValue) {

    if (!dateValue) {

        return "N/A";

    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {

        return dateValue;

    }

    return date.toLocaleString(
        "en-IN"
    );

}


/* ==========================================================
        RENDER HISTORY TABLE
========================================================== */

function renderHistoryTable(
    data = history
) {

    historyTableBody.innerHTML = "";


    /* ==========================
            EMPTY RESULT
    ========================== */

    if (data.length === 0) {

        historyTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="text-center text-muted py-5">

                    <i class="bi bi-clock-history display-5"></i>

                    <br><br>

                    No quiz history found.

                </td>

            </tr>

        `;

        return;

    }


    data.forEach((item, index) => {

        const statusClass =
            item.status === "Pass"

                ?

                "badge bg-success"

                :

                "badge bg-danger";


        historyTableBody.innerHTML += `

        <tr>

            <td>
                ${index + 1}
            </td>

            <td>
                ${formatDate(item.submittedAt)}
            </td>

            <td>
                ${item.subject || "N/A"}
            </td>

            <td>
                ${item.totalQuestions || 0}
            </td>

            <td>
                ${item.correct || 0}
            </td>

            <td>
                ${item.wrong || 0}
            </td>

            <td>
                ${item.score || 0}/${item.totalQuestions || 0}
            </td>

            <td>
                ${item.percentage || 0}%
            </td>

            <td>

                <span class="${statusClass}">

                    ${item.status || "N/A"}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-sm btn-primary view-result"
                    data-id="${item._id}"
                    title="View Details">

                    <i class="bi bi-eye-fill"></i>

                </button>

                <button
                    class="btn btn-sm btn-danger delete-result ms-1"
                    data-id="${item._id}"
                    title="Delete">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

}


/* ==========================================================
        SEARCH
========================================================== */

searchInput.addEventListener(
    "input",
    filterHistory
);


/* ==========================================================
        SUBJECT FILTER
========================================================== */

subjectFilter.addEventListener(
    "change",
    filterHistory
);


/* ==========================================================
        FILTER HISTORY
========================================================== */

function filterHistory() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedSubject =
        subjectFilter.value
            .toLowerCase();


    const filteredHistory =
        history.filter(item => {

            const student =
                (
                    item.studentName || ""
                )
                .toLowerCase();

            const subject =
                (
                    item.subject || ""
                )
                .toLowerCase();

            const status =
                (
                    item.status || ""
                )
                .toLowerCase();

            const grade =
                (
                    item.grade || ""
                )
                .toLowerCase();

            const score =
                String(
                    item.score || ""
                );

            const percentage =
                String(
                    item.percentage || ""
                );


            const matchSearch =

                student.includes(searchValue) ||

                subject.includes(searchValue) ||

                status.includes(searchValue) ||

                grade.includes(searchValue) ||

                score.includes(searchValue) ||

                percentage.includes(searchValue);


            const matchSubject =

                selectedSubject === "all" ||

                subject === selectedSubject;


            return (
                matchSearch &&
                matchSubject
            );

        });


    renderHistoryTable(
        filteredHistory
    );

}


/* ==========================================================
        CLEAR ALL HISTORY
========================================================== */

clearHistoryBtn.addEventListener(
    "click",
    async () => {

        if (history.length === 0) {

            alert(
                "No quiz history available."
            );

            return;

        }


        const confirmDelete =
            confirm(
                "Are you sure you want to clear your complete quiz history?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const response =
                await fetch(
                    "/api/my-results",
                    {

                        method: "DELETE",

                        credentials: "include"

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to clear history."
                );

                return;

            }


            history = [];


            loadAnalytics();

            renderHistoryTable();


            alert(
                "History cleared successfully."
            );

        }

        catch (error) {

            console.error(
                "Clear History Error:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        }

    }
);


/* ==========================================================
        EXPORT HISTORY
========================================================== */

exportBtn.addEventListener(
    "click",
    () => {

        if (history.length === 0) {

            alert(
                "No history available to export."
            );

            return;

        }


        let csv =
            "Date,Subject,Total Questions,Correct,Wrong,Score,Percentage,Status\n";


        history.forEach(item => {

            csv +=

                `"${formatDate(item.submittedAt)}",` +

                `"${item.subject || ""}",` +

                `${item.totalQuestions || 0},` +

                `${item.correct || 0},` +

                `${item.wrong || 0},` +

                `"${item.score || 0}/${item.totalQuestions || 0}",` +

                `"${item.percentage || 0}%",` +

                `"${item.status || ""}"\n`;

        });


        const blob =
            new Blob(
                [csv],
                {
                    type: "text/csv"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;


        link.download =
            `${currentUser.studentId}_Result_History.csv`;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );

    }
);


/* ==========================================================
        DASHBOARD BUTTON
========================================================== */

dashboardBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "/dashboard";

    }
);


/* ==========================================================
        START QUIZ BUTTON
========================================================== */

if (startQuizBtn) {

    startQuizBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "/dashboard";

        }
    );

}


/* ==========================================================
        VIEW RESULT
========================================================== */

historyTableBody.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".view-result"
            );


        if (!button) {

            return;

        }


        const resultId =
            button.dataset.id;


        const result =
            history.find(
                item =>
                    item._id === resultId
            );


        if (!result) {

            alert(
                "Result not found."
            );

            return;

        }


        alert(

            `Quiz Details

Subject : ${result.subject}

Date : ${formatDate(result.submittedAt)}

Score : ${result.score}/${result.totalQuestions}

Correct : ${result.correct}

Wrong : ${result.wrong}

Percentage : ${result.percentage}%

Grade : ${result.grade}

Status : ${result.status}`

        );

    }
);


/* ==========================================================
        DELETE SINGLE ATTEMPT
========================================================== */

historyTableBody.addEventListener(
    "click",
    async event => {

        const deleteButton =
            event.target.closest(
                ".delete-result"
            );


        if (!deleteButton) {

            return;

        }


        const resultId =
            deleteButton.dataset.id;


        const result =
            history.find(
                item =>
                    item._id === resultId
            );


        if (!result) {

            alert(
                "Result not found."
            );

            return;

        }


        const confirmDelete =
            confirm(
                `Delete this quiz attempt?\n\n${result.subject}\n${formatDate(result.submittedAt)}`
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const response =
                await fetch(
                    `/api/results/${resultId}`,
                    {

                        method: "DELETE",

                        credentials: "include"

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to delete result."
                );

                return;

            }


            history =
                history.filter(
                    item =>
                        item._id !== resultId
                );


            loadAnalytics();

            renderHistoryTable();


            alert(
                "Attempt deleted successfully."
            );

        }

        catch (error) {

            console.error(
                "Delete Result Error:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        }

    }
);


/* ==========================================================
        INITIALIZE PAGE
========================================================== */

async function initializeHistory() {

    const authenticated =
        await getCurrentUser();


    if (!authenticated) {

        return;

    }


    await loadHistory();


    console.log(
        "===================================="
    );

    console.log(
        "History Module Loaded Successfully"
    );

    console.log(
        "Student:",
        currentUser.fullName
    );

    console.log(
        "Student ID:",
        currentUser.studentId
    );

    console.log(
        "===================================="
    );

}


initializeHistory();