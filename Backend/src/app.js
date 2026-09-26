const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
// require all the routes here
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes")

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}))

app.use(express.json());

// using all auth routes here
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Global error handler (Express 5 forwards async errors here)
app.use((err, req, res, next) => {
    console.error("❌ Unhandled Error:", err)
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    })
})

module.exports = app;