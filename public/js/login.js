/*=========================================================
        AASRAA Skillability Centre
        Login Page JavaScript
=========================================================*/

"use strict";

/* ==========================================
        SELECT ELEMENTS
========================================== */

const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const rememberMe = document.getElementById("rememberMe");

const togglePassword = document.getElementById("togglePassword");


/* ==========================================
        SHOW / HIDE PASSWORD
========================================== */

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i class="bi bi-eye-slash"></i>';

    }

    else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i class="bi bi-eye"></i>';

    }

});


/* ==========================================
        VALIDATE EMAIL
========================================== */

function validateEmail(emailValue) {

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(emailValue);

}


/* ==========================================
        INPUT STYLE
========================================== */

function setValid(input) {

    input.classList.remove("is-invalid");

    input.classList.add("is-valid");

}

function setInvalid(input) {

    input.classList.remove("is-valid");

    input.classList.add("is-invalid");

}


/* ==========================================
        REMEMBER USER
========================================== */

window.addEventListener("load", () => {

    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail) {

        email.value = savedEmail;

        rememberMe.checked = true;

    }

});/* ==========================================
        LOGIN FORM SUBMIT
========================================== */

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    let isValid = true;

    /* ==========================
            EMAIL
    ========================== */

    if (!validateEmail(email.value.trim())) {

        setInvalid(email);

        isValid = false;

    } else {

        setValid(email);

    }

    /* ==========================
            PASSWORD
    ========================== */

    if (password.value.trim().length < 8) {

        setInvalid(password);

        isValid = false;

    } else {

        setValid(password);

    }

    if (!isValid) {

        return;

    }

    /* ==========================
            LOGIN WITH MONGODB
    ========================== */

    let user;

    try {

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email: email.value.trim(),
                password: password.value
            })
        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        user = data.user;

        console.log("User Found:", user);

    }

    catch (error) {

        console.error("Login Error:", error);

        alert("Unable to connect to server.");

        return;

    }
    /* ==========================
            REMEMBER ME
    ========================== */

    if (rememberMe.checked) {

        localStorage.setItem(

            "rememberEmail",

            email.value.trim()

        );

    } else {

        localStorage.removeItem("rememberEmail");

    }

    /* ==========================
            SAVE CURRENT USER
    ========================== */

    localStorage.setItem(

        "currentUser",

        JSON.stringify(user)

    );

    console.log(
        "Current User Saved:",
        localStorage.getItem("currentUser")
    );

    /* ==========================
            SUCCESS MESSAGE
    ========================== */

    alert(

        `Welcome ${user.fullName}

Student ID : ${user.studentId}

Login Successful.`

    );

    /* ==========================
            REDIRECT
    ========================== */

    setTimeout(() => {

        window.location.href = "/dashboard";

    }, 1200);

});


/* ==========================================
        ENTER KEY SUPPORT
========================================== */

document.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        if (document.activeElement.tagName !== "TEXTAREA") {

            // Browser form submit automatically karega

        }

    }

});


/* ==========================================
        AUTO LOGIN CHECK
========================================== */

window.addEventListener("load", () => {

    const currentUser = JSON.parse(

        localStorage.getItem("currentUser")

    );

    if (currentUser) {

        console.log(

            "User already logged in:",

            currentUser.fullName

        );

    }

});


/* ==========================================
        LOGOUT FUNCTION
        (Dashboard me use hoga)
========================================== */

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "/login";

}


/* ==========================================
        CONSOLE MESSAGE
========================================== */

console.log("=======================================");

console.log(" Login Page Loaded Successfully ");

console.log("=======================================");

