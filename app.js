const express = require("express");

const routes = require("./Routes/index.js")
 
const app = express();

app.use(express.json());

app.use("/api/v1",routes)

app.get('/', (req, res) => {

     res.send({ data: [], success: true, message: "server is running" })
});

const PORT = process.env.PORT || 3000;


app.listen(3000, () => {
     console.log(`server listening at http://localhost:3000`);
     
});

