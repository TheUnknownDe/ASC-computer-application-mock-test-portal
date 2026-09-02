/* ===========================================================
        IMPORT MODULES
=========================================================== */

const express = require("express");

const MongoStore = require("connect-mongo").default;

const path = require("path");

require("dotenv").config();

const connectDB = require("./config/database");

const User = require("./models/User");

const Counter = require("./models/Counter");

const Result = require("./models/Result");

const bcrypt = require("bcrypt");

const session = require("express-session");

const nodemailer = require("nodemailer");

/* ===========================================================
        EMAIL TRANSPORTER
=========================================================== */

const emailTransporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASSWORD

    }

});

/* ===========================================================
        CREATE EXPRESS APP
=========================================================== */

const app = express();

connectDB();



const PORT = process.env.PORT || 3000;

/* ===========================================================
        MIDDLEWARE
=========================================================== */

// Read JSON Data

app.use(express.json());

// Read Form Data

app.use(express.urlencoded({

    extended: true

}));

/* ===========================================================
        SESSION MIDDLEWARE
=========================================================== */
app.set("trust proxy", 1);
app.use(session({

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({

        mongoUrl: process.env.MONGODB_URI

    }),

    cookie: {

        httpOnly: true,

        secure: process.env.NODE_ENV === "production",

        maxAge: 1000 * 60 * 60 * 24

    }

}));

/* ===========================================================
        STATIC FILES
=========================================================== */

app.use(

    express.static(

        path.join(__dirname, "public")

    )

);/* ===========================================================
        HOME PAGE
=========================================================== */

app.get("/", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "home.html"

        )

    );

});

/* ===========================================================
        REGISTER PAGE
=========================================================== */

app.get("/register", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "register.html"

        )

    );

});

/* ===========================================================
        LOGIN PAGE
=========================================================== */

app.get("/login", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "login.html"

        )

    );

});

/* ===========================================================
        PROTECTED STUDENT DASHBOARD
=========================================================== */

app.get("/dashboard", (request, response) => {

    if (!request.session.userId) {

        return response.redirect("/login");

    }

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "dashboard.html"

        )

    );

});

/* ===========================================================
        QUIZ PAGE
=========================================================== */

app.get("/quiz", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "quiz.html"

        )

    );

});

/* ===========================================================
        RESULT PAGE
=========================================================== */

app.get("/result", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "result.html"

        )

    );

});

/* ===========================================================
        HISTORY PAGE
=========================================================== */

app.get("/history", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "history.html"

        )

    );

});

/* ===========================================================
        STUDENT PROFILE PAGE
=========================================================== */

app.get("/profile", (request, response) => {

    // Check student login session
    if (!request.session.userId) {

        return response.redirect("/login");

    }

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "profile.html"

        )

    );

});


/* ===========================================================
        GET STUDENT PROFILE API
=========================================================== */

app.get("/api/profile", async (request, response) => {

    try {

        // ==========================================
        // CHECK STUDENT LOGIN
        // ==========================================

        if (!request.session.userId) {

            return response.status(401).json({

                success: false,

                message: "Student authentication required."

            });

        }


        // ==========================================
        // FIND LOGGED-IN STUDENT
        // ==========================================

        const student = await User.findById(

            request.session.userId

        ).select("-password");


        // ==========================================
        // STUDENT NOT FOUND
        // ==========================================

        if (!student) {

            return response.status(404).json({

                success: false,

                message: "Student account not found."

            });

        }


        // ==========================================
        // CHECK ACCOUNT STATUS
        // ==========================================

        if (student.status === "Deleted") {

            request.session.destroy(() => { });

            return response.status(403).json({

                success: false,

                message: "This account has been deleted."

            });

        }


        // ==========================================
        // SEND PROFILE DATA
        // ==========================================

        response.json({

            success: true,

            profile: {

                studentId: student.studentId,

                fullName: student.fullName,

                email: student.email,

                phone: student.phone,

                dob: student.dob,

                gender: student.gender,

                status: student.status,

                createdAt: student.createdAt

            }

        });

    }

    catch (error) {

        console.error(

            "Get Student Profile Error:",

            error

        );

        response.status(500).json({

            success: false,

            message: "Unable to load student profile."

        });

    }

});


/* ===========================================================
        ADMIN LOGIN PAGE
=========================================================== */

app.get("/admin-login", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "admin-login.html"

        )

    );

});

/* ===========================================================
        ADMIN LOGIN API
=========================================================== */

app.post("/api/admin/login", async (request, response) => {

    try {

        const { username, password } = request.body;

        // Admin credentials
        if (
            username !== "adminskillability" ||
            password !== "admin@ASC2026"
        ) {

            return response.status(401).json({

                success: false,

                message: "Invalid Username or Password."

            });

        }

        // Create Admin Session
        request.session.adminLoggedIn = true;

        request.session.adminName = "Administrator";

        response.json({

            success: true,

            message: "Admin Login Successful"

        });

    }

    catch (error) {

        console.error("Admin Login Error:", error);

        response.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});

/* ===========================================================
        ADMIN LOGOUT API
=========================================================== */

app.post("/api/admin/logout", (request, response) => {

    console.log("ADMIN LOGOUT API CALLED");

    request.session.destroy((error) => {

        if (error) {

            console.error("Admin Logout Error:", error);

            return response.status(500).json({

                success: false,

                message: "Logout Failed"

            });

        }

        response.json({

            success: true,

            message: "Admin Logout Successful"

        });

    });

});

/* ===========================================================
        ADMIN DASHBOARD
=========================================================== */

app.get("/admin-dashboard", (request, response) => {

    if (!request.session.adminLoggedIn) {

        return response.redirect("/admin-login");

    }

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "admin-dashboard.html"

        )

    );

});

/* ===========================================================
        GET ALL STUDENTS
=========================================================== */

app.get("/api/admin/students", async (request, response) => {

    try {

        // Admin authentication check
        if (!request.session.adminLoggedIn) {

            return response.status(401).json({

                success: false,

                message: "Admin authentication required."

            });

        }

        const students = await User.find({

            status: { $ne: "Deleted" }

        }).select(
            "-password"
        );

        response.json({

            success: true,

            students: students

        });

    }

    catch (error) {

        console.error(
            "Get Students Error:",
            error
        );

        response.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});

/* ===========================================================
        STUDENTS PAGE
=========================================================== */

app.get("/students", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "admin-students.html"

        )

    );

});

/* ===========================================================
        RESULTS PAGE
=========================================================== */

app.get("/results", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "results.html"

        )

    );

});

/* ===========================================================
        QUESTIONS PAGE
=========================================================== */

app.get("/questions", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "questions.html"

        )

    );

});

/* ===========================================================
        GENERATE UNIQUE STUDENT ID
=========================================================== */

async function generateStudentId() {

    const counter = await Counter.findByIdAndUpdate(

        { _id: "studentId" },

        { $inc: { sequenceValue: 1 } },

        {

            new: true,

            upsert: true

        }

    );

    const year = new Date().getFullYear();

    return `ASC${year}${String(counter.sequenceValue).padStart(4, "0")}`;

}

/* ===========================================================
        REGISTER API
=========================================================== */

app.post("/api/register", async (request, response) => {

    try {

        const {

            fullName,

            email,

            phone,

            dob,

            gender,

            password

        } = request.body;

        // Check Duplicate Email

        const existingUser = await User.findOne({

            email: email

        });

        if (existingUser) {

            return response.status(400).json({

                success: false,

                message: "Email already registered."

            });

        }
        const studentId = await generateStudentId();

        // Create User
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({

            studentId,

            fullName,

            email,

            phone: phone,

            dob,

            gender,

            password: hashedPassword,

            status: "Active"

        });

        await newUser.save();

        response.status(201).json({

            success: true,

            message: "Registration Successful",

            studentId: studentId

        });

    }

    catch (error) {

        console.error(error);

        response.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});

/* ===========================================================
        STUDENT LOGIN API
=========================================================== */
app.post("/api/login", async (request, response) => {

    try {

        const { email, password } = request.body;

        const user = await User.findOne({

            email: email.trim().toLowerCase()

        });

        if (!user) {

            return response.status(401).json({

                success: false,

                message: "Invalid Email or Password."

            });

        }

        if (user.status === "Deleted") {

            return response.status(403).json({

                success: false,

                message: "This account has been deleted."

            });

        }

        let passwordMatch = false;

        // Check whether password is already a bcrypt hash
        const isBcryptHash =
            user.password.startsWith("$2a$") ||
            user.password.startsWith("$2b$") ||
            user.password.startsWith("$2y$");

        if (isBcryptHash) {

            // Existing secure password
            passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

        } else {

            // Old plain-text password
            passwordMatch =
                password === user.password;

            // If correct, immediately convert it to bcrypt
            if (passwordMatch) {

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                await User.updateOne(

                    { _id: user._id },

                    {
                        $set: {
                            password: hashedPassword
                        }
                    }

                );

                user.password = hashedPassword;

                console.log(
                    "Old password migrated to bcrypt:",
                    user.studentId
                );

            }

        }

        if (!passwordMatch) {

            return response.status(401).json({

                success: false,

                message: "Invalid Email or Password."

            });

        }

        /*================================
            Create Student Session
        =================================*/

        request.session.userId =
            user._id.toString();

        request.session.studentId =
            user.studentId;

        request.session.userName =
            user.fullName;

        console.log("========================================");
        console.log("LOGIN SESSION CREATED");
        console.log("Session ID:", request.sessionID);
        console.log("User ID:", request.session.userId);
        console.log("Student ID:", request.session.studentId);
        console.log("========================================");


        /*================================
            Save Student Session
        =================================*/

        request.session.save((error) => {

            if (error) {

                console.error(
                    "Session Save Error:",
                    error
                );

                return response.status(500).json({

                    success: false,

                    message:
                        "Unable to create login session."

                });

            }


            /*================================
                Login Success Response
            =================================*/

            response.json({

                success: true,

                message: "Login Successful",

                user: {

                    studentId:
                        user.studentId,

                    fullName:
                        user.fullName,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    dob:
                        user.dob,

                    gender:
                        user.gender,

                    status:
                        user.status

                }

            });

        });

    }

    catch (error) {

        console.error(
            "Login Error:",
            error
        );

        response.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});

/* ===========================================================
        FORGOT PASSWORD PAGE
=========================================================== */

app.get("/forgot-password", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "forgot-password.html"

        )

    );

});

/* ===========================================================
        GET CURRENT LOGGED-IN STUDENT
=========================================================== */


app.get("/api/me", async (request, response) => {

    try {

        console.log("========================================");
        console.log("API ME SESSION CHECK");
        console.log("Session ID:", request.sessionID);
        console.log("User ID:", request.session.userId);
        console.log("Student ID:", request.session.studentId);
        console.log("========================================");

        // Check student session
        if (!request.session.userId) {

            return response.status(401).json({

                success: false,

                message: "Student authentication required."

            });

        }

        // Find student in MongoDB
        const student = await User.findById(
            request.session.userId
        ).select("-password");

        if (!student) {

            return response.status(404).json({

                success: false,

                message: "Student not found."

            });

        }

        // Check deleted account
        if (student.status === "Deleted") {

            request.session.destroy(() => { });

            return response.status(403).json({

                success: false,

                message: "This account has been deleted."

            });

        }

        response.json({

            success: true,

            user: {

                studentId: student.studentId,

                fullName: student.fullName,

                email: student.email,

                phone: student.phone,

                dob: student.dob,

                gender: student.gender,

                status: student.status,

                createdAt: student.createdAt

            }

        });

    }

    catch (error) {

        console.error(
            "Get Current Student Error:",
            error
        );

        response.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});

/* ===========================================================
        FORGOT PASSWORD - SEND OTP
=========================================================== */

app.post("/api/forgot-password", async (request, response) => {

    try {

        const { email } = request.body;

        // Validate email
        if (!email) {

            return response.status(400).json({

                success: false,

                message: "Email address is required."

            });

        }

        // Find student
        const user = await User.findOne({

            email: email.trim().toLowerCase()

        });

        // Do not reveal whether email exists
        if (!user) {

            return response.json({

                success: true,

                message:
                    "If this email is registered, an OTP has been sent."

            });

        }

        // Generate 6-digit OTP
        const otp =
            Math.floor(100000 + Math.random() * 900000).toString();

        // OTP expiry - 10 minutes
        const otpExpires =
            Date.now() + 10 * 60 * 1000;

        // Store OTP temporarily in session
        request.session.resetPassword = {

            userId: user._id.toString(),

            otp: otp,

            expiresAt: otpExpires

        };

        // Email
        await emailTransporter.sendMail({

            from: `"AASRAA Skillability Centre" <${process.env.EMAIL_USER}>`,

            to: user.email,

            subject: "Password Reset OTP - AASRAA Skillability Centre",

            text:
                `Your password reset OTP is ${otp}. ` +
                `This OTP is valid for 10 minutes. ` +
                `Do not share this OTP with anyone.`

        });

        console.log(

            "Password Reset OTP Sent:",

            user.email

        );

        response.json({

            success: true,

            message:
                "OTP has been sent to your registered email address."

        });

    }

    catch (error) {

        console.error(

            "Forgot Password Error:",

            error

        );

        response.status(500).json({

            success: false,

            message:
                "Unable to send OTP. Please try again later."

        });

    }

});

/* ===========================================================
        VERIFY OTP API
=========================================================== */

/* ===========================================================
        VERIFY OTP API
=========================================================== */

app.post("/api/verify-otp", async (request, response) => {

    try {

        const { otp } = request.body;


        // ======================================
        // Check OTP entered
        // ======================================

        if (!otp) {

            return response.status(400).json({

                success: false,

                message: "OTP is required."

            });

        }


        // ======================================
        // Get Reset Password Session
        // ======================================

        const resetData =
            request.session.resetPassword;


        if (!resetData) {

            return response.status(400).json({

                success: false,

                message:
                    "OTP session expired. Please request a new OTP."

            });

        }


        // ======================================
        // Check OTP Expiry
        // ======================================

        if (Date.now() > resetData.expiresAt) {

            delete request.session.resetPassword;

            return response.status(400).json({

                success: false,

                message:
                    "OTP has expired. Please request a new OTP."

            });

        }


        // ======================================
        // Check OTP
        // ======================================

        if (otp.toString() !== resetData.otp.toString()) {

            return response.status(400).json({

                success: false,

                message:
                    "Invalid OTP. Please enter the correct OTP."

            });

        }


        // ======================================
        // OTP VERIFIED
        // ======================================

        request.session.resetPassword.verified = true;


        // ======================================
        // Remove OTP
        // OTP cannot be reused
        // ======================================

        delete request.session.resetPassword.otp;


        // ======================================
        // Save Session
        // ======================================

        request.session.save((error) => {

            if (error) {

                console.error(
                    "OTP Session Save Error:",
                    error
                );

                return response.status(500).json({

                    success: false,

                    message:
                        "Unable to save OTP verification."

                });

            }


            console.log(
                "OTP VERIFIED SUCCESSFULLY"
            );

            console.log(
                "Reset User ID:",
                request.session.resetPassword.userId
            );


            response.json({

                success: true,

                message:
                    "OTP verified successfully."

            });

        });

    }

    catch (error) {

        console.error(
            "Verify OTP Error:",
            error
        );

        response.status(500).json({

            success: false,

            message:
                "Unable to verify OTP."

        });

    }

});

/* ===========================================================
        VERIFY OTP PAGE
=========================================================== */

app.get("/verify-otp", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "verify-otp.html"

        )

    );

});

/* ===========================================================
        RESET PASSWORD PAGE
=========================================================== */

app.get("/reset-password", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,
            "views",
            "reset-password.html"

        )

    );

});


/* ===========================================================
        STUDENT LOGOUT API
=========================================================== */

app.post("/api/logout", (request, response) => {

    console.log("STUDENT LOGOUT API CALLED");

    request.session.destroy((error) => {

        if (error) {

            console.error(
                "Student Logout Error:",
                error
            );

            return response.status(500).json({

                success: false,

                message: "Logout Failed"

            });

        }

        response.clearCookie("connect.sid");

        response.json({

            success: true,

            message: "Logout Successful"

        });

    });

});

/* ===========================================================
        GET LOGGED-IN STUDENT RESULTS
=========================================================== */

app.get("/api/my-results", async (request, response) => {

    try {

        // ==========================================
        // CHECK LOGIN
        // ==========================================

        if (!request.session.userId) {

            return response.status(401).json({

                success: false,

                message: "Student authentication required."

            });

        }


        // ==========================================
        // GET CURRENT STUDENT
        // ==========================================

        const student = await User.findById(
            request.session.userId
        );

        if (!student) {

            return response.status(404).json({

                success: false,

                message: "Student account not found."

            });

        }


        // ==========================================
        // CHECK DELETED ACCOUNT
        // ==========================================

        if (student.status === "Deleted") {

            request.session.destroy(() => { });

            return response.status(403).json({

                success: false,

                message: "This account has been deleted."

            });

        }


        // ==========================================
        // GET ONLY THIS STUDENT'S RESULTS
        // ==========================================

        const results = await Result.find({

            studentId: student.studentId

        }).sort({

            submittedAt: -1

        });


        // ==========================================
        // SEND RESULTS
        // ==========================================

        response.json({

            success: true,

            results: results

        });

    }

    catch (error) {

        console.error(
            "Get Student Results Error:",
            error
        );

        response.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});

/* ===========================================================
        DELETE SINGLE QUIZ RESULT
=========================================================== */

app.delete("/api/results/:id", async (request, response) => {

    try {

        // Check student session
        if (!request.session.userId) {

            return response.status(401).json({

                success: false,

                message: "Student authentication required."

            });

        }

        const result = await Result.findOneAndDelete({

            _id: request.params.id,

            studentId: request.session.studentId

        });

        if (!result) {

            return response.status(404).json({

                success: false,

                message: "Quiz result not found."

            });

        }

        response.json({

            success: true,

            message: "Quiz attempt deleted successfully."

        });

    }

    catch (error) {

        console.error(
            "Delete Result Error:",
            error
        );

        response.status(500).json({

            success: false,

            message: "Unable to delete quiz result."

        });

    }

});


/* ===========================================================
        CLEAR ALL QUIZ HISTORY
=========================================================== */

app.delete("/api/my-results", async (request, response) => {

    try {

        // Check student session
        if (!request.session.userId) {

            return response.status(401).json({

                success: false,

                message: "Student authentication required."

            });

        }

        const result =
            await Result.deleteMany({

                studentId: request.session.studentId

            });

        response.json({

            success: true,

            message: "Quiz history cleared successfully.",

            deletedCount: result.deletedCount

        });

    }

    catch (error) {

        console.error(
            "Clear History Error:",
            error
        );

        response.status(500).json({

            success: false,

            message: "Unable to clear quiz history."

        });

    }

});

 /* ===========================================================
        RESET PASSWORD API
=========================================================== */

app.post("/api/reset-password", async (request, response) => {

    try {

        // ======================================
        // Check OTP Verification
        // ======================================

        const resetData =
            request.session.resetPassword;

        if (!resetData || !resetData.verified) {

            return response.status(401).json({

                success: false,

                message: "OTP verification required."

            });

        }


        // ======================================
        // Get Password
        // ======================================

        const {
            newPassword,
            confirmPassword
        } = request.body;


        // ======================================
        // Validate Password
        // ======================================

        if (!newPassword || !confirmPassword) {

            return response.status(400).json({

                success: false,

                message: "Please enter both passwords."

            });

        }


        if (newPassword.length < 8) {

            return response.status(400).json({

                success: false,

                message:
                    "Password must be at least 8 characters long."

            });

        }


        if (newPassword !== confirmPassword) {

            return response.status(400).json({

                success: false,

                message: "Passwords do not match."

            });

        }


        // ======================================
        // Find User From Reset Session
        // ======================================

        const user = await User.findById(
            resetData.userId
        );


        if (!user) {

            return response.status(404).json({

                success: false,

                message: "Student account not found."

            });

        }


        // ======================================
        // Check Account Status
        // ======================================

        if (user.status === "Deleted") {

            return response.status(403).json({

                success: false,

                message: "This account has been deleted."

            });

        }


        // ======================================
        // Hash New Password
        // ======================================

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);


        // ======================================
        // Update Password
        // ======================================

        await User.updateOne(

            { _id: resetData.userId },

            {
                $set: {
                    password: hashedPassword
                }
            }

        );


        // ======================================
        // Clear Reset Session
        // ======================================

        delete request.session.resetPassword;


        // ======================================
        // Save Session
        // ======================================

        request.session.save((error) => {

            if (error) {

                console.error(
                    "Reset Session Save Error:",
                    error
                );

                return response.status(500).json({

                    success: false,

                    message:
                        "Password changed but session cleanup failed."

                });

            }


            // ======================================
            // Success
            // ======================================

            response.json({

                success: true,

                message:
                    "Password reset successfully. Please login with your new password."

            });

        });

    }

    catch (error) {

        console.error(
            "Reset Password Error:",
            error
        );

        response.status(500).json({

            success: false,

            message:
                "Unable to reset password."

        });

    }

});
/* ===========================================================
        SAVE QUIZ RESULT API
=========================================================== */

app.post("/api/results", async (request, response) => {

    try {

        // ==========================================
        // CHECK STUDENT LOGIN
        // ==========================================

        if (!request.session.userId) {

            return response.status(401).json({

                success: false,

                message: "Student authentication required."

            });

        }


        // ==========================================
        // GET LOGGED-IN STUDENT FROM DATABASE
        // ==========================================

        const student = await User.findById(
            request.session.userId
        );

        if (!student) {

            return response.status(404).json({

                success: false,

                message: "Student account not found."

            });

        }


        // ==========================================
        // CHECK DELETED ACCOUNT
        // ==========================================

        if (student.status === "Deleted") {

            return response.status(403).json({

                success: false,

                message: "This account has been deleted."

            });

        }


        // ==========================================
        // GET QUIZ DATA
        // ==========================================

        const resultData = request.body;


        // ==========================================
        // CREATE RESULT USING SESSION STUDENT ID
        // ==========================================

        const newResult = new Result({

            // IMPORTANT:
            // Do NOT take studentId from browser
            studentId: student.studentId,

            // IMPORTANT:
            // Do NOT take studentName from browser
            studentName: student.fullName,

            subject: resultData.subject,

            totalQuestions: resultData.totalQuestions,

            attempted: resultData.attempted,

            unattempted: resultData.unattempted,

            correct: resultData.correct,

            score: resultData.score,

            wrong: resultData.wrong,

            percentage: resultData.percentage,

            grade: resultData.grade,

            status: resultData.status,

            timeTaken: resultData.timeTaken,

            answers: resultData.answers,

            questions: resultData.questions,

            timeLeft: resultData.timeLeft

        });


        // ==========================================
        // SAVE RESULT
        // ==========================================

        await newResult.save();


        console.log(
            "Quiz Result Saved:",
            student.studentId,
            resultData.subject
        );


        // ==========================================
        // RESPONSE
        // ==========================================

        response.status(201).json({

            success: true,

            message: "Quiz result saved successfully.",

            resultId: newResult._id

        });

    }

    catch (error) {

        console.error(
            "Save Result Error:",
            error
        );

        response.status(500).json({

            success: false,

            message: "Unable to save quiz result."

        });

    }

});

/* ===========================================================
        DELETE STUDENT (SOFT DELETE)
=========================================================== */

app.put("/api/students/delete/:id", async (request, response) => {

    try {

        // Admin authentication check
        if (!request.session.adminLoggedIn) {

            return response.status(401).json({

                success: false,

                message: "Admin authentication required."

            });

        }

        const student =
            await User.findByIdAndUpdate(

                request.params.id,

                {
                    status: "Deleted"
                },

                {
                    new: true
                }

            );

        if (!student) {

            return response.status(404).json({

                success: false,

                message: "Student not found."

            });

        }

        response.json({

            success: true,

            message: "Student deleted successfully."

        });

    }

    catch (error) {

        console.error(
            "Delete Student Error:",
            error
        );

        response.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});

/* ===========================================================
        START SERVER
=========================================================== */

app.listen(PORT, "0.0.0.0", () => {

    console.log("========================================");

    console.log("Server Started Successfully");

    console.log(`Server Running On : http://localhost:${PORT}`);

    console.log("========================================");

});