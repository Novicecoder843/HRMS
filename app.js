const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// connect database
require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/company", require("./routes/companyRoute"));
app.use("/api/roles", require("./routes/roleRoute"));
app.use("/api/users", require("./routes/userRoute"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});