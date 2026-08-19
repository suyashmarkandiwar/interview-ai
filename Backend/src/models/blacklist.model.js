const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added to blacklist"]
    }
}, {
    timestamps: true // it creates createdAt and updatedAt timestamps automatically
});

// here we are creating a model which is used to interact with the collection in the database
const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema);

module.exports = tokenBlacklistModel;