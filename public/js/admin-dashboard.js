/*=========================================================
        AASRAA Skillability Centre
        Admin Dashboard JavaScript
=========================================================*/

"use strict";

/* ==========================================
        ADMIN LOGIN CHECK
========================================== */



/* ==========================================
        DOM ELEMENTS
========================================== */

const adminName =
    document.getElementById("adminName");

const currentDate =
    document.getElementById("currentDate");

const totalStudents =
    document.getElementById("totalStudents");

const totalAttempts =
    document.getElementById("totalAttempts");

const averageScore =
    document.getElementById("averageScore");

const passPercentage =
    document.getElementById("passPercentage");

const recentResultsBody =
    document.getElementById("recentResultsBody");

const studentsBtn =
    document.getElementById("studentsBtn");

const resultsBtn =
    document.getElementById("resultsBtn");

const exportBtn =
    document.getElementById("exportBtn");

const logoutBtn =
    document.getElementById("logoutBtn");
const logoutBtnBottom =
    document.getElementById("logoutBtnBottom");

/* ==========================================
        LOAD ADMIN
========================================== */

adminName.textContent =
    "Administrator";

/* ==========================================
        DATE
========================================== */

const today = new Date();

currentDate.textContent =
    today.toLocaleDateString("en-IN", {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric"

    });

/* ==========================================
        LOAD DATA
========================================== */

const users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];

const results =
    JSON.parse(
        localStorage.getItem("results")
    ) || [];
    console.log(results);

/* ==========================================
        TOTAL STUDENTS
========================================== */

totalStudents.textContent =
    users.length;

/* ==========================================
        TOTAL ATTEMPTS
========================================== */

totalAttempts.textContent =
    results.length;

/* ==========================================
        AVERAGE SCORE
========================================== */

if (results.length === 0) {

    averageScore.textContent = "0%";

} else {

    let total = 0;

    results.forEach(result => {

        total += result.score;

    });

    averageScore.textContent =

        Math.round(total / results.length) + "%";

}

/* ==========================================
        PASS PERCENTAGE
========================================== */

if (results.length === 0) {

    passPercentage.textContent = "0%";

} else {

    const passed =

        results.filter(result =>

            result.percentage >= 40

        ).length;

    const percentage =

        Math.round(

            (passed / results.length) * 100

        );

    passPercentage.textContent =

        percentage + "%";

}

/* ==========================================
        RECENT RESULTS
========================================== */

function loadRecentResults() {

    recentResultsBody.innerHTML = "";

    if (results.length === 0) {

        recentResultsBody.innerHTML = `

        <tr>

            <td colspan="7">

                No Results Available

            </td>

        </tr>

        `;

        return;

    }

    const latest =

        [...results]

            .reverse()

            .slice(0, 10);

    latest.forEach(result => {

        const status =

            result.percentage >= 40 ?

                "Pass"

                :

                "Fail";

        const statusClass =

            result.percentage >= 40 ?

                "status-pass"

                :

                "status-fail";

        recentResultsBody.innerHTML += `

        <tr>

            <td>

                ${result.studentName}

            </td>

            <td>

                ${result.studentId}

            </td>

            <td>

                ${result.subject}

            </td>

            <td>

                ${result.correctAnswers}/${result.totalQuestions}

            </td>

            <td>

                ${result.percentage}%

            </td>

            <td>

                <span class="${statusClass}">

                    ${status}

                </span>

            </td>

            <td>

                ${result.date}

            </td>

        </tr>

        `;

    });

}

loadRecentResults();

/* ==========================================
        BUTTONS
========================================== */

studentsBtn.addEventListener("click", () => {

    window.location.href = "/students";

});



resultsBtn.addEventListener("click", () => {

    window.location.href = "/results";

});

/* ==========================================
        EXPORT CSV
========================================== */

exportBtn.addEventListener("click", () => {

    if (results.length === 0) {

        alert("No Result Available.");

        return;

    }

    let csv =

        "Student Name,Student ID,Subject,Score,Percentage,Status,Date\n";

    results.forEach(result => {

        csv +=

            `${result.date},

${result.studentId},

${result.subject},

${result.correctAnswers}/${result.totalQuestions},

${result.percentage}%,

${result.percentage >= 40 ? "Pass" : "Fail"},

${result.date}\n`;

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

    link.download =

        "Quiz_Results.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});

/* ==========================================
        LOGOUT
========================================== */

async function adminLogout() {

    if (!confirm("Are you sure you want to logout?")) {

        return;

    }

    try {

        const response = await fetch(
            "/api/admin/logout",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Logout failed."
            );

            return;

        }

        console.log(
            "Admin Logout Successful"
        );

        window.location.href =
            "/admin-login";

    }

    catch (error) {

        console.error(
            "Admin Logout Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}


/* ==========================================
        LOGOUT BUTTONS
========================================== */

logoutBtn.addEventListener(
    "click",
    adminLogout
);

logoutBtnBottom.addEventListener(
    "click",
    adminLogout
);

/* ==========================================
        CONSOLE
========================================== */

console.log("====================================");

console.log("Admin Dashboard Loaded");

console.log("Admin : Administrator");

console.log("====================================");