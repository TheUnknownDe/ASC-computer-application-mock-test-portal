// ======================================
// Forgot Password
// ======================================

"use strict";

// ======================================
// DOM Elements
// ======================================

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

const emailInput =
    document.getElementById("email");

const message =
    document.getElementById("message");

const sendOtpBtn =
    document.getElementById("sendOtpBtn");

// ======================================
// Show Message
// ======================================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `alert alert-${type}`;

}

// ======================================
// Forgot Password Form
// ======================================

forgotPasswordForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        emailInput.value.trim().toLowerCase();

    if (!email) {

        showMessage(
            "Please enter your email address.",
            "warning"
        );

        return;

    }

    // Disable button

    sendOtpBtn.disabled = true;

    sendOtpBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2"></span>
        Sending OTP...
    `;

    try {

        const response = await fetch(
            "/api/forgot-password",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                credentials: "include",

                body: JSON.stringify({

                    email: email

                })

            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            showMessage(
                data.message ||
                "Unable to process request.",
                "danger"
            );

            return;

        }

        showMessage(
            data.message ||
            "OTP sent successfully.",
            "success"
        );

        // Next step will redirect to OTP page.
        setTimeout(() => {

            window.location.href = "/verify-otp";

        }, 1000);

    }

    catch (error) {

        console.error(
            "Forgot Password Error:",
            error
        );

        showMessage(
            "Unable to connect to server.",
            "danger"
        );

    }

    finally {

        sendOtpBtn.disabled = false;

        sendOtpBtn.innerHTML = `
            <i class="bi bi-send-fill"></i>
            Send OTP
        `;

    }

});

console.log(
    "Forgot Password Module Loaded Successfully."
);