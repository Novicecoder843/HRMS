const express = require("express");
const app = express();
require("dotenv").config();

const userRoutes = require("./routes/user.routes");
const companyRoutes = require("./routes/company.routes");
const departmentRoutes = require("./routes/department.routes");
const designationRoutes = require("./routes/designation.routes");


// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
