const express = require("express");
const cors = require("cors");
require("dotenv").config();

const companyRoute = require("./Routes/companyRoutes");
const userRoute = require("./Routes/userRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/company", companyRoute);
app.use("/api/users", userRoute);

// PORT configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});