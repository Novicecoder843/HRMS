const  express = require("express");

import routes from "./routes/index.js";


const app = express();
//middelware -- 
app.use(express.json());


app.use("/api/v1", routes);
app.use(errorMiddleware);
localhost:4000/api/v1/users/adduser

localhost:4000/api/v1/companies
sequelize.sync({ alter: false }).then(() => console.log("Database connected ✅"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
