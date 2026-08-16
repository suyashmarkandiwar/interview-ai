const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: [true, "Username is required"],
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        unique: [true, "Email already taken"],
        required: [true, "Email is required"]
    },

    password: {
        type: String,
        required: true
    }
    
})

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
