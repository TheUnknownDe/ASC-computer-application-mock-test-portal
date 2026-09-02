"use strict";

/* ==========================================================
        AASRAA Skillability Centre
        Students Module
========================================================== */

/* ==========================================================
        DOM ELEMENTS
========================================================== */

const adminName =
    document.getElementById("adminName");

const currentDate =
    document.getElementById("currentDate");

const totalStudents =
    document.getElementById("totalStudents");

const activeStudents =
    document.getElementById("activeStudents");

const maleStudents =
    document.getElementById("maleStudents");

const femaleStudents =
    document.getElementById("femaleStudents");

const searchInput =
    document.getElementById("searchInput");

const studentsTableBody =
    document.getElementById("studentsTableBody");

const dashboardBtn =
    document.getElementById("dashboardBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


/* ==========================================================
        MODAL ELEMENTS
========================================================== */

const modalStudentId =
    document.getElementById("modalStudentId");

const modalStudentName =
    document.getElementById("modalStudentName");

const modalStudentEmail =
    document.getElementById("modalStudentEmail");

const modalStudentPhone =
    document.getElementById("modalStudentPhone");

const modalStudentDob =
    document.getElementById("modalStudentDob");

const modalStudentGender =
    document.getElementById("modalStudentGender");

const modalStudentStatus =
    document.getElementById("modalStudentStatus");

const modalCreatedAt =
    document.getElementById("modalCreatedAt");


/* ==========================================================
        LOAD USERS
========================================================== */
let students = [];

let filteredStudents = [];

/* ==========================================================
        LOAD STUDENTS FROM MONGODB
========================================================== */

async function loadStudents() {

    try {

        const response =
            await fetch("/api/admin/students");

        const data =
            await response.json();

        if (!response.ok) {

            if (response.status === 401) {

                window.location.href =
                    "/admin-login";

                return;

            }

            alert(
                data.message ||
                "Unable to load students."
            );

            return;

        }

        students =
            data.students || [];

        filteredStudents =
            [...students];

        loadAnalytics();

        renderStudents();

    }

    catch (error) {

        console.error(
            "Load Students Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}
/* ==========================================================
        CURRENT DATE
========================================================== */

adminName.textContent = "Administrator";

const today = new Date();

currentDate.textContent =
    today.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "long",

        year: "numeric"

    });


/* ==========================================================
        LOAD ANALYTICS
========================================================== */

function loadAnalytics() {

    totalStudents.textContent =
        students.length;

    activeStudents.textContent =
        students.filter(student =>

            student.status === "Active"

        ).length;

    maleStudents.textContent =
        students.filter(student =>

            student.gender === "Male"

        ).length;

    femaleStudents.textContent =
        students.filter(student =>

            student.gender === "Female"

        ).length;

}


/* ==========================================================
        RENDER STUDENTS TABLE
========================================================== */

function renderStudents(data = filteredStudents) {

    studentsTableBody.innerHTML = "";

    if (data.length === 0) {

        studentsTableBody.innerHTML = `

        <tr>

            <td colspan="8"
                class="text-center py-5">

                No Students Found

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((student, index) => {

        studentsTableBody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${student.studentId}</td>

            <td>${student.fullName}</td>

            <td>${student.email}</td>

            <td>${student.phone}</td>

            <td>${student.gender}</td>

            <td>

                

            <span class="${student.status === "Active"
                ?
                "status-active"
                :
                "status-inactive"
            }">

                ${student.status}

            </span>



            </td>

            <td>

                <button
                    class="action-btn view-btn"
                    onclick="viewStudent(${index})">

                    <i class="bi bi-eye-fill"></i>

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteStudent(${index})">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

}
/* ==========================================================
        SEARCH STUDENT
========================================================== */

searchInput.addEventListener("input", () => {

    const value =
        searchInput.value
            .toLowerCase()
            .trim();

    filteredStudents =
        students.filter(student =>

            student.fullName
                .toLowerCase()
                .includes(value)

            ||

            student.studentId
                .toLowerCase()
                .includes(value)

            ||

            student.email
                .toLowerCase()
                .includes(value)

        );

    renderStudents();

});


/* ==========================================================
        VIEW STUDENT
========================================================== */

function viewStudent(index) {

    const student =
        filteredStudents[index];

    modalStudentId.textContent =
        student.studentId;

    modalStudentName.textContent =
        student.fullName;

    modalStudentEmail.textContent =
        student.email;

    modalStudentPhone.textContent =
        student.phone || "N/A";

    modalStudentDob.textContent =
        student.dob || "N/A";

    modalStudentGender.textContent =
        student.gender;

    modalStudentStatus.textContent =
        student.status;

    modalCreatedAt.textContent =
        student.createdAt || "N/A";

    const modal =
        new bootstrap.Modal(

            document.getElementById("studentModal")

        );

    modal.show();

}


/* ==========================================================
        DELETE STUDENT
========================================================== */

async function deleteStudent(index) {

    const student =
        filteredStudents[index];

    const confirmDelete =
        confirm(

            `Delete Student?

${student.fullName}

(${student.studentId})`

        );

    if (!confirmDelete) {

        return;

    }

    try {

        const response =
            await fetch(
                `/api/students/delete/${student._id}`,
                {
                    method: "PUT"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to delete student."
            );

            return;

        }

        alert(
            "Student deleted successfully."
        );

        await loadStudents();

    }

    catch (error) {

        console.error(
            "Delete Student Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}


/* ==========================================================
        DASHBOARD BUTTON
========================================================== */

console.log(dashboardBtn);

dashboardBtn.addEventListener("click", () => {

    window.location.href =
        "/admin-dashboard";

});


/* ==========================================================
        LOGOUT
========================================================== */

logoutBtn.addEventListener("click", async () => {

    const confirmLogout =
        confirm("Logout Admin?");

    if (!confirmLogout) {

        return;

    }

    try {

        const response =
            await fetch(
                "/api/admin/logout",
                {
                    method: "POST"
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Logout failed."
            );

            return;

        }

        window.location.href =
            "/admin-login";

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

});


/* ==========================================================
        INITIALIZE PAGE
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadStudents();

    }
);


/* ==========================================================
        CONSOLE
========================================================== */

console.log("====================================");

console.log("Students Module Loaded Successfully");

console.log("====================================");