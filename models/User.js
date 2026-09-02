"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    studentId: {

        type: String,

        required: true,

        unique: true,

        trim: true

    },

    fullName: {

        type: String,

        required: true,

        trim: true

    },

    email: {

        type: String,

        required: true,

        unique: true,

        lowercase: true,

        trim: true

    },

    phone: {

        type: String,

        required: true,

        trim: true

    },

    dob: {

        type: Date,

        required: true

    },

    gender: {

        type: String,

        required: true,

        trim: true

    },

    password: {

        type: String,

        required: true

    },

    status: {

        type: String,

        enum: ["Active", "Deleted"],

        default: "Active"

    },

    createdAt: {

        type: Date,

        default: Date.now

    }



});

module.exports = mongoose.model("User", userSchema);