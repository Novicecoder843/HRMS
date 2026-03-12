require("dotenv").config();
const express = require("express");
const companyRoutes = require("./Routes/company.routes");
const roleRoutes = require("./Routes/role.routes");
const userRoutes = require("./Routes/user.routes");
const profileRoutes = require("./Routes/profile.routes");

const app = express();

app.use(express.json());

app.use("/api/company", companyRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("api/v1/profile",profileRoutes)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
