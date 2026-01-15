const express = require("express");
const routes = require("./Routes");

const app = express();

app.use(express.json());
app.use("/api/v1", routes);

app.get("/", (req, res) => {
     res.send({ data: [], success: true, message: "server is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
     console.log(`server listening at http://localhost:${PORT}`);
});

