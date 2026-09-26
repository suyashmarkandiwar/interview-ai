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
// The above line compiles your schema into a Mongoose Model.

// It does two main things:
// 1. Binds to a Collection: It links your userSchema to a specific collection in your MongoDB database named "users".

// 2. Provides an Interface: It creates the userModel object, which gives you all the built-in methods (like .findOne(), .save(), or .create()) needed to interact with and query that collection.
module.exports = userModel;
