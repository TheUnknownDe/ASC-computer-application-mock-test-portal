"use strict";

/* ==========================================
        SELECT ELEMENTS
========================================== */

const form =
    document.getElementById("adminLoginForm");

const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

/* ==========================================
        SHOW PASSWORD
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
        LOGIN
========================================== */

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const usernameValue =
        username.value.trim();

    const passwordValue =
        password.value;

    if (!usernameValue || !passwordValue) {

        alert("Please enter Username and Password.");

        return;

    }

    try {

        const response = await fetch("/api/admin/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                username: usernameValue,

                password: passwordValue

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        console.log("Admin Login Successful");

        window.location.href =
            "/admin-dashboard";

    }

    catch (error) {

        console.error(
            "Admin Login Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

});

console.log("Admin Login Loaded");