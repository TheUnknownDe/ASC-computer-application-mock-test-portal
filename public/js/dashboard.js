/*=========================================================
        AASRAA Skillability Centre
        Dashboard JavaScript
=========================================================*/

"use strict";

/* ==========================================
        GET CURRENT USER FROM SERVER
========================================== */

let currentUser = null;

async function getCurrentUser() {

    try {

        const response = await fetch("/api/me", {

            method: "GET",

            credentials: "include"

        });

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Please login first."
            );

            window.location.href = "/login";

            return false;

        }

        currentUser = data.user;

        console.log(
            "Current Student Loaded:",
            currentUser
        );

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

/* ==========================================
        SELECT ELEMENTS
========================================== */

const navUserName = document.getElementById("navUserName");

const studentName = document.getElementById("studentName");

const profileName = document.getElementById("profileName");

const studentId = document.getElementById("studentId");

const studentEmail = document.getElementById("studentEmail");

const currentDate = document.getElementById("currentDate");

const logoutBtn = document.getElementById("logoutBtn");

const logoutBottomBtn = document.getElementById("logoutBottomBtn");

/* ==========================================
        LOAD USER DETAILS
========================================== */

function loadUserProfile() {

    navUserName.textContent =
        currentUser.fullName;

    studentName.textContent =
        currentUser.fullName;

    profileName.textContent =
        currentUser.fullName;

    studentId.textContent =
        currentUser.studentId;

    studentEmail.textContent =
        currentUser.email;

}

/* ==========================================
        SHOW CURRENT DATE
========================================== */

function showCurrentDate() {

    const today = new Date();

    currentDate.textContent =
        today.toLocaleDateString("en-IN", {

            weekday: "long",

            day: "numeric",

            month: "long",

            year: "numeric"

        });

}

/* ==========================================
        LOAD USER STATISTICS FROM MONGODB
========================================== */

async function loadStatistics() {

    try {

        const response = await fetch("/api/my-results", {

            method: "GET",

            credentials: "include"

        });

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Unable to load results:",
                data.message
            );

            return;

        }

        const userResults = data.results || [];

        document.getElementById("completedTests").textContent =
            userResults.length;

        document.getElementById("totalTests").textContent = 6;

        if (userResults.length === 0) {

            document.getElementById("highestScore").textContent = "0%";

            document.getElementById("averageScore").textContent = "0%";

            return;

        }

        let highest = 0;

        let total = 0;

        userResults.forEach(result => {

            const percentage =
                Number(result.percentage) || 0;

            if (percentage > highest) {

                highest = percentage;

            }

            total += percentage;

        });

        document.getElementById("highestScore").textContent =
            highest + "%";

        document.getElementById("averageScore").textContent =
            Math.round(
                total / userResults.length
            ) + "%";

    }

    catch (error) {

        console.error(
            "Load Statistics Error:",
            error
        );

    }

}
/* ==========================================
        LOAD RECENT ACTIVITY FROM MONGODB
========================================== */

async function loadRecentActivity() {

    const container =
        document.getElementById("activityContainer");

    if (!container) {

        return;

    }

    try {

        const response = await fetch(
            "/api/my-results",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Unable to load recent activity:",
                data.message
            );

            return;

        }

        const userResults =
            data.results || [];

        if (userResults.length === 0) {

            container.innerHTML = `
                <div class="text-center text-muted py-4">
                    No test activity yet.
                </div>
            `;

            return;

        }

        container.innerHTML = "";

        userResults
            .slice(0, 5)
            .forEach(result => {

                const submittedDate =
                    result.submittedAt
                        ? new Date(
                            result.submittedAt
                        ).toLocaleString("en-IN")
                        : "N/A";

                container.innerHTML += `

                <div class="card mb-3">

                    <div class="card-body">

                        <h5>
                            ${result.subject}
                        </h5>

                        <p class="mb-1">

                            Score :
                            <strong>
                                ${result.percentage}%
                            </strong>

                        </p>

                        <small class="text-muted">

                            ${submittedDate}

                        </small>

                    </div>

                </div>

                `;

            });

    }

    catch (error) {

        console.error(
            "Load Recent Activity Error:",
            error
        );

    }

}
/* ==========================================
        START QUIZ
========================================== */

const quizButtons =
    document.querySelectorAll(".start-test");

quizButtons.forEach(button => {

    button.addEventListener("click", () => {

        const subject =
            button.dataset.subject;

        localStorage.setItem(
            "selectedSubject",
            subject
        );

        window.location.href =
            `/quiz?subject=${subject}`;

    });

});

/* ==========================================
        QUICK ACTIONS
========================================== */

document.getElementById("profileBtn")
    .addEventListener("click", () => {

        window.location.href = "/profile";

    });

document.getElementById("resultBtn")
    .addEventListener("click", () => {

        window.location.href = "/result";

    });

document.getElementById("historyBtn")
    .addEventListener("click", () => {

        window.location.href = "/history";

    });

/* ==========================================
        LOGOUT
========================================== */

async function logout() {

    if (!confirm("Are you sure you want to logout?")) {

        return;

    }

    try {

        const response =
            await fetch("/api/logout", {

                method: "POST"

            });

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Logout failed."
            );

            return;

        }

        // Remove old browser-side user data
        localStorage.removeItem("currentUser");

        // Return to home page
        window.location.href = "/";

    }

    catch (error) {

        console.error(
            "Logout Error:",
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

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );

}

if (logoutBottomBtn) {

    logoutBottomBtn.addEventListener(
        "click",
        logout
    );

}

/* ==========================================
        INITIALIZE DASHBOARD
========================================== */

async function initializeDashboard() {

    const authenticated =
        await getCurrentUser();

    if (!authenticated) {

        return;

    }

    loadUserProfile();

    showCurrentDate();

    loadStatistics();

    loadRecentActivity();

    console.log("====================================");

    console.log(
        " Dashboard Loaded Successfully "
    );

    console.log(
        " Logged in User :",
        currentUser.fullName
    );

    console.log("====================================");

}

initializeDashboard();

/* ==========================================
        CONSOLE
========================================== */

console.log(
    " Logged in User :",
    currentUser.fullName
);