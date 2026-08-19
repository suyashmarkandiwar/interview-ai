const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
// require all the routes here
const authRouter = require("./routes/auth.routes");

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use(express.json());

// using all auth routes here
app.use("/api/auth", authRouter)

module.exports = app;