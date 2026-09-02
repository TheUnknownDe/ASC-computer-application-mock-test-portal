/*=========================================================
        AASRAA Skillability Centre
        Register Page JavaScript
=========================================================*/

"use strict";

/* ==========================================
        SELECT ELEMENTS
========================================== */

const registerForm = document.getElementById("registerForm");

const fullName = document.getElementById("fullName");

const email = document.getElementById("email");

const phone = document.getElementById("phone");

const dob = document.getElementById("dob");

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirmPassword");

const terms = document.getElementById("terms");

const togglePassword = document.getElementById("togglePassword");

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");


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


toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";

        toggleConfirmPassword.innerHTML =
            '<i class="bi bi-eye-slash"></i>';

    }

    else {

        confirmPassword.type = "password";

        toggleConfirmPassword.innerHTML =
            '<i class="bi bi-eye"></i>';

    }

});


/* ==========================================
        VALIDATION FUNCTIONS
========================================== */

function validateEmail(emailValue) {

    const emailPattern =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(emailValue);

}


function validatePhone(phoneValue) {

    const phonePattern = /^[6-9]\d{9}$/;

    return phonePattern.test(phoneValue);

}


function validatePassword(passwordValue) {

    return passwordValue.length >= 8;

}


/* ==========================================
        INPUT VALIDATION STYLE
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
        REGISTER FORM SUBMIT
========================================== */

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    let isValid = true;


    // ==========================
    // Full Name
    // ==========================

    if (fullName.value.trim().length < 3) {

        setInvalid(fullName);

        isValid = false;

    } else {

        setValid(fullName);

    }


    // ==========================
    // Email
    // ==========================

    if (!validateEmail(email.value.trim())) {

        setInvalid(email);

        isValid = false;

    } else {

        setValid(email);

    }


    // ==========================
    // Phone
    // ==========================

    if (!validatePhone(phone.value.trim())) {

        setInvalid(phone);

        isValid = false;

    } else {

        setValid(phone);

    }


    // ==========================
    // Date of Birth
    // ==========================

    if (dob.value === "") {

        setInvalid(dob);

        isValid = false;

    } else {

        setValid(dob);

    }


    // ==========================
    // Gender
    // ==========================

    const gender = document.querySelector('input[name="gender"]:checked');

    if (!gender) {

        alert("Please select your gender.");

        isValid = false;

    }


    // ==========================
    // Password
    // ==========================

    if (!validatePassword(password.value)) {

        setInvalid(password);

        isValid = false;

    } else {

        setValid(password);

    }


    // ==========================
    // Confirm Password
    // ==========================

    if (password.value !== confirmPassword.value) {

        setInvalid(confirmPassword);

        alert("Passwords do not match.");

        isValid = false;

    } else {

        setValid(confirmPassword);

    }


    // ==========================
    // Terms
    // ==========================

    if (!terms.checked) {

        alert("Please accept the Terms & Conditions.");

        isValid = false;

    }


    if (!isValid) {

        return;

    }


    /* ==========================================
            CHECK DUPLICATE EMAIL
    ========================================== */

    // const users = JSON.parse(localStorage.getItem("users")) || [];

    // const emailExists = users.find(user => user.email === email.value.trim());

    // if (emailExists) {

    //     alert("An account with this email already exists.");

    //     return;

    // }


    /* ==========================================
            CREATE USER OBJECT
    ========================================== */

    const user = {

        studentId: "",

        fullName: fullName.value.trim(),

        email: email.value.trim(),

        phone: phone.value.trim(),

        dob: dob.value,

        gender: gender.value,

        password: password.value,

        createdAt: new Date().toLocaleString(),

        status: "Active"

    };

    /* ==========================================
        SAVE USER IN MONGODB
========================================== */

    try {

        const response = await fetch("/api/register", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                fullName: user.fullName,

                email: user.email,

                phone: user.phone,

                dob: user.dob,

                gender: user.gender,

                password: user.password

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        user.studentId = data.studentId;

        // Temporary Backup (Remove Later)

        // users.push(user);

        // localStorage.setItem("users", JSON.stringify(users));

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

        return;

    }


    /* ==========================================
            SUCCESS MESSAGE
    ========================================== */

    alert(

        `Registration Successful!

Student ID : ${user.studentId}

Please login using your Email and Password.`

    );


    registerForm.reset();


    document.querySelectorAll(".form-control").forEach(input => {

        input.classList.remove("is-valid");

    });


    /* ==========================================
            REDIRECT
    ========================================== */

    setTimeout(() => {

        console.log(user);

        window.location.href = "/login";

    }, 1500);

});


/* ==========================================
        PHONE INPUT (Numbers Only)
========================================== */

phone.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

});


/* ==========================================
        PASSWORD STRENGTH
========================================== */

password.addEventListener("input", () => {

    if (password.value.length >= 8) {

        setValid(password);

    }

    else {

        setInvalid(password);

    }

});


/* ==========================================
        CONSOLE MESSAGE
========================================== */

console.log("========================================");

console.log(" Register Page Loaded Successfully ");

console.log("========================================");