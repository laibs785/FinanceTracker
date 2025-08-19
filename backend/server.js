const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/budgets", require("./routes/budgets"));
app.use("/api/users", require("./routes/user"));

// Root endpoint (test)
app.get("/", (req, res) => {
  res.send("🚀 Finance Tracker Backend Running");
});

// Error handling middleware (after routes)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // optional stack trace in dev
  });
});

// Dynamic port for Railway
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`📡 Server running on port ${PORT}`));
