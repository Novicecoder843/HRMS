const express = require("express");
const cors = require("cors");

const companyRoute = require("./routes/companyRoute");
const userRoute = require("./routes/userRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/company", companyRoute);
app.use("/api/users", userRoute);

app.listen(process.env.PORT,()=>{

console.log("Server running on port",process.env.PORT);

});