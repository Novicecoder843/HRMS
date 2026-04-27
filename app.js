const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// 🔗 DB CONNECTION
require("./config/db");

const app = express();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ ROUTES
app.use("/api/company", require("./routes/companyRoute"));
app.use("/api/roles", require("./routes/roleRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/departments", require("./routes/departmentRoute"));
app.use("/api/designations", require("./routes/designationRoute"));
app.use("/api/attendances",require("./routes/attendanceRoute"));


// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("🚀 HRMS Backend Running...");
});


// ❌ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong ❌",
    error: err.message
  });
});


// 🚀 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});