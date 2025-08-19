const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");


dotenv.config();
connectDB();

const app = express();



// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // 👈 Your React app
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/users', require('./routes/user'));

// Root endpoint (optional)
app.get("/", (req, res) => {
  res.send("🚀 Expense Tracker Backend Running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`📡 Server running on port ${PORT}`));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack); // Log error

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Optional: only in dev
  });
});