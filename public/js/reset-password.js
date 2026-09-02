// ======================================
// Reset Password
// ======================================

"use strict";

// ======================================
// DOM Elements
// ======================================

const resetPasswordForm =
    document.getElementById("resetPasswordForm");

const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const resetPasswordBtn =
    document.getElementById("resetPasswordBtn");

const message =
    document.getElementById("message");

const toggleNewPassword =
    document.getElementById("toggleNewPassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


// ======================================
// Show Message
// ======================================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `alert alert-${type}`;

}


// ======================================
// Toggle New Password
// ======================================

toggleNewPassword.addEventListener("click", () => {

    if (newPasswordInput.type === "password") {

        newPasswordInput.type = "text";

        toggleNewPassword.innerHTML =
            `<i class="bi bi-eye-slash"></i>`;

    }

    else {

        newPasswordInput.type = "password";

        toggleNewPassword.innerHTML =
            `<i class="bi bi-eye"></i>`;

    }

});


// ======================================
// Toggle Confirm Password
// ======================================

toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPasswordInput.type === "password") {

        confirmPasswordInput.type = "text";

        toggleConfirmPassword.innerHTML =
            `<i class="bi bi-eye-slash"></i>`;

    }

    else {

        confirmPasswordInput.type = "password";

        toggleConfirmPassword.innerHTML =
            `<i class="bi bi-eye"></i>`;

    }

});


// ======================================
// Reset Password Form
// ======================================

resetPasswordForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const newPassword =
            newPasswordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        // ======================================
        // Password Length
        // ======================================

        if (newPassword.length < 8) {

            showMessage(
                "Password must be at least 8 characters long.",
                "warning"
            );

            return;

        }


        // ======================================
        // Password Match
        // ======================================

        if (newPassword !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "danger"
            );

            return;

        }


        // ======================================
        // Disable Button
        // ======================================

        resetPasswordBtn.disabled = true;

        resetPasswordBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Resetting Password...
        `;


        try {

            const response =
                await fetch(
                    "/api/reset-password",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        credentials: "include",

                        body: JSON.stringify({

                            newPassword:
                                newPassword,

                            confirmPassword:
                                confirmPassword

                        })

                    }
                );


            const data =
                await response.json();


            // ======================================
            // API Error
            // ======================================

            if (!response.ok) {

                showMessage(

                    data.message ||
                    "Unable to reset password.",

                    "danger"

                );

                return;

            }


            // ======================================
            // Success
            // ======================================

            showMessage(

                data.message ||
                "Password reset successfully.",

                "success"

            );


            // ======================================
            // Redirect Login
            // ======================================

            setTimeout(() => {

                window.location.href =
                    "/login";

            }, 1500);

        }


        catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            showMessage(
                "Unable to connect to server.",
                "danger"
            );

        }


        finally {

            resetPasswordBtn.disabled = false;

            resetPasswordBtn.innerHTML = `
                <i class="bi bi-key-fill"></i>
                Reset Password
            `;

        }

    }
);


console.log(
    "Reset Password Module Loaded Successfully."
);