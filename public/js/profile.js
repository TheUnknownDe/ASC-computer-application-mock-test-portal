/* ===========================================================
   STUDENT PROFILE
=========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", async () => {

    console.log("PROFILE JS LOADED");

    const loadingMessage =
        document.getElementById("loadingMessage");

    const profileContent =
        document.getElementById("profileContent");

    const errorMessage =
        document.getElementById("errorMessage");

    const errorText =
        document.getElementById("errorText");

    const studentId =
        document.getElementById("studentId");

    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const dob =
        document.getElementById("dob");

    const gender =
        document.getElementById("gender");

    const status =
        document.getElementById("status");

    const createdAt =
        document.getElementById("createdAt");


    /* ===========================================================
       LOAD PROFILE
    =========================================================== */

    try {

        console.log("Requesting /api/profile...");

        const response = await fetch("/api/profile", {
            method: "GET",
            credentials: "include"
        });

        console.log(
            "Profile API Status:",
            response.status
        );

        const data = await response.json();

        console.log(
            "Profile API Response:",
            data
        );


        /* =======================================================
           LOGIN REQUIRED
        ======================================================= */

        if (response.status === 401) {

            alert("Please login first.");

            localStorage.removeItem("currentUser");
            localStorage.removeItem("quizResult");
            localStorage.removeItem("selectedSubject");

            window.location.href = "/login";

            return;
        }


        /* =======================================================
           OTHER ERROR
        ======================================================= */

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load profile."
            );

        }


        /* =======================================================
           PROFILE DATA
        ======================================================= */

        const profile = data.profile;

        console.log(
            "Student Profile:",
            profile
        );


        /* =======================================================
           STUDENT ID
        ======================================================= */

        if (studentId) {

            studentId.textContent =
                profile.studentId ||
                "Not Available";

        }


        /* =======================================================
           FULL NAME
        ======================================================= */

        if (fullName) {

            fullName.textContent =
                profile.fullName ||
                "Not Available";

        }


        /* =======================================================
           EMAIL
        ======================================================= */

        if (email) {

            email.textContent =
                profile.email ||
                "Not Available";

        }


        /* =======================================================
           PHONE
        ======================================================= */

        if (phone) {

            phone.textContent =
                profile.phone ||
                "Not Available";

        }


        /* =======================================================
           DATE OF BIRTH
        ======================================================= */

        if (dob) {

            if (profile.dob) {

                const date =
                    new Date(profile.dob);

                if (!isNaN(date.getTime())) {

                    dob.textContent =
                        date.toLocaleDateString(
                            "en-IN"
                        );

                } else {

                    dob.textContent =
                        profile.dob;

                }

            } else {

                dob.textContent =
                    "Not Available";

            }

        }


        /* =======================================================
           GENDER
        ======================================================= */

        if (gender) {

            gender.textContent =
                profile.gender ||
                "Not Available";

        }


        /* =======================================================
           ACCOUNT STATUS
        ======================================================= */

        if (status) {

            status.textContent =
                profile.status ||
                "Not Available";

            if (
                profile.status === "Active"
            ) {

                status.classList.add(
                    "status-active"
                );

            }

        }


        /* =======================================================
           ACCOUNT CREATED DATE
        ======================================================= */

        if (createdAt) {

            if (profile.createdAt) {

                const createdDate =
                    new Date(
                        profile.createdAt
                    );

                if (
                    !isNaN(
                        createdDate.getTime()
                    )
                ) {

                    createdAt.textContent =
                        createdDate.toLocaleDateString(
                            "en-IN"
                        );

                } else {

                    createdAt.textContent =
                        profile.createdAt;

                }

            } else {

                createdAt.textContent =
                    "Not Available";

            }

        }


        /* =======================================================
           SHOW PROFILE
        ======================================================= */

        if (loadingMessage) {
            loadingMessage.classList.add("d-none");
        }

        if (profileContent) {
            profileContent.classList.remove("d-none");
        }


    } catch (error) {

        console.error(
            "Profile Loading Error:",
            error
        );

        if (loadingMessage) {
            loadingMessage.classList.add("d-none");
        }

        if (errorMessage) {
            errorMessage.classList.remove("d-none");
        }

        if (errorText) {

            errorText.textContent =
                error.message ||
                "Unable to load student profile.";

        }

    }


    /* ===========================================================
       BACK TO DASHBOARD
    =========================================================== */

    const backDashboardBtn =
        document.getElementById(
            "backDashboardBtn"
        );

    if (backDashboardBtn) {

        backDashboardBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "/dashboard";

            }
        );

    }


    /* ===========================================================
       LOGOUT
    =========================================================== */

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            async () => {

                try {

                    await fetch(
                        "/api/logout",
                        {
                            method: "POST",
                            credentials: "include"
                        }
                    );

                } catch (error) {

                    console.error(
                        "Logout Error:",
                        error
                    );

                } finally {

                    localStorage.removeItem(
                        "currentUser"
                    );

                    localStorage.removeItem(
                        "quizResult"
                    );

                    localStorage.removeItem(
                        "selectedSubject"
                    );

                    window.location.href =
                        "/login";

                }

            }
        );

    }

});