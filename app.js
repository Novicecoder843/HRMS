const express = require("express");
const routes = require("./Routes");
const { authenticate } = require("../HRMS/middlewares/auth_middleware");
const path = require("path");

const app = express();
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");

app.use(express.json());

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
     res.setHeader("Content-Type", "application/json");
     res.send(swaggerSpec);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/v1", authenticate, routes);

app.get("/", (req, res) => {
     res.send({ data: [], success: true, message: "server is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
     console.log(`server listening at http://localhost:${PORT}`);
});

