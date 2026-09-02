"use strict";

const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({

    studentName: {
        type: String,
        required: true,
        trim: true
    },

    studentId: {
        type: String,
        required: true,
        trim: true
    },

    subject: {
        type: String,
        required: true,
        trim: true
    },

    totalQuestions: {
        type: Number,
        required: true
    },

    attempted: {
        type: Number,
        required: true
    },

    unattempted: {
        type: Number,
        required: true
    },

    correct: {
        type: Number,
        required: true
    },

    score: {
        type: Number,
        required: true
    },

    wrong: {
        type: Number,
        required: true
    },

    percentage: {
        type: Number,
        required: true
    },

    grade: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Pass", "Fail"],
        required: true
    },

    timeTaken: {
        type: Number,
        required: true
    },

    answers: {
        type: [String],
        default: []
    },

    questions: {
        type: Array,
        default: []
    },

    timeLeft: {
        type: Number,
        default: 0
    },

    submittedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Result", resultSchema);