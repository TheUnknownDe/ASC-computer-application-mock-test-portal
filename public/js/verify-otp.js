// ======================================
// Verify OTP
// ======================================

"use strict";

// ======================================
// DOM Elements
// ======================================

const verifyOtpForm =
    document.getElementById("verifyOtpForm");

const otpInput =
    document.getElementById("otp");

const verifyOtpBtn =
    document.getElementById("verifyOtpBtn");

const message =
    document.getElementById("message");


// ======================================
// Show Message
// ======================================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `alert alert-${type}`;

}


// ======================================
// Allow Only Numbers
// ======================================

otpInput.addEventListener("input", () => {

    otpInput.value =
        otpInput.value.replace(/\D/g, "");

});


// ======================================
// Verify OTP
// ======================================

verifyOtpForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const otp =
            otpInput.value.trim();

        // Check OTP length

        if (otp.length !== 6) {

            showMessage(
                "Please enter a valid 6-digit OTP.",
                "warning"
            );

            return;

        }

        // Disable button

        verifyOtpBtn.disabled = true;

        verifyOtpBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Verifying...
        `;

        try {

            console.log("Sending OTP verification request...");

            const response =
                await fetch(
                    "/api/verify-otp",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        credentials: "include",

                        body: JSON.stringify({

                            otp: otp

                        })

                    }
                );

                console.log("OTP API Response Received:", response.status);

            const data =
                await response.json();

            if (!response.ok) {

                showMessage(

                    data.message ||
                    "OTP verification failed.",

                    "danger"

                );

                return;

            }

            showMessage(

                data.message ||
                "OTP verified successfully.",

                "success"

            );

            // Password reset page

            setTimeout(() => {

                window.location.href =
                    "/reset-password";

            }, 1000);

        }

        catch (error) {

            console.error(

                "OTP Verification Error:",
                error

            );

            showMessage(

                "Unable to connect to server.",

                "danger"

            );

        }

        finally {

            verifyOtpBtn.disabled = false;

            verifyOtpBtn.innerHTML = `
                <i class="bi bi-check-circle-fill"></i>
                Verify OTP
            `;

        }

    }
);


console.log(
    "Verify OTP Module Loaded Successfully."
);