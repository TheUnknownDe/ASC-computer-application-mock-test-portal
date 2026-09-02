"use strict";

/* ==========================================
        IMPORT MONGOOSE
========================================== */

const mongoose = require("mongoose");

/* ==========================================
        CONNECT DATABASE
========================================== */

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("====================================");

        console.log(" MongoDB Connected Successfully");

        console.log("====================================");

    }

    catch (error) {

        console.log("====================================");

        console.error(" MongoDB Connection Failed");

        console.error(error.message);

        console.log("====================================");

        process.exit(1);

    }

};

/* ==========================================
        EXPORT
========================================== */

module.exports = connectDB;