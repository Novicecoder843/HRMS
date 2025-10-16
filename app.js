// const  express = require("express");
// import dotenv from "dotenv";
// import routes from "./routes/index.js";
// import sequelize from "./config/db.config.js";
// import errorMiddleware from "./middleware/error.middleware.js";

// dotenv.config();

// const app = express();
//middelware -- 
// app.use(express.json());
// http://localhost:4000/api/v1/user/adduser
// http://localhost:4000/api/v1/user/deleteuser
// http://localhost:4000/api/v1/user/updateuser

// http://localhost:4000/api/v1/attandnce/getattend
// http://localhost:4000/api/v1/attandnce/insertattendcne

// app.use("/api/v1", routes);
// app.use(errorMiddleware);

// sequelize.sync({ alter: false }).then(() => console.log("Database connected ✅"));

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const sequelize = require("./src/config/db.config");

// sequelize.sync({ alter: true })
//   .then(() => console.log("✅ Models synced with database"))
//   .catch((err) => console.log("❌ Error syncing models:", err));






const express = require("express");
const routes = require("./routes/index");
const sequelize = require("./config/db.config");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1", routes);

// Error middleware
app.use(errorMiddleware);

// Sequelize DB connection
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database connected and models synced"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
