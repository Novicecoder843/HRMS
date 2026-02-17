const swaggerJsdoc = require("swagger-jsdoc");

const options = {
     definition: {
          openapi: "3.0.0",
          info: {
               title: "HRMS API Documentation",
               version: "1.0.0",
               description: "HRMS Backend API Documentation",
          },
          servers: [
               {
                    url: "http://localhost:3000/api/v1",
               },
          ],
          components: {
               securitySchemes: {
                    bearerAuth: {
                         type: "http",
                         scheme: "bearer",
                         bearerFormat: "JWT",
                    },
               },
          },
          security: [
               {
                    bearerAuth: [],
               },
          ],
     },
     apis: ["./Routes/*.js"], // 🔥 Important (your folder name is Routes)
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

