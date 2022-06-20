const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Gear Lap",
      description: "Sell Lap And Gear",
      contact: {
        name: "Gear Lap",
      },
      servers: ["http://localhost:5000"],
    },
  },
  apis: ["./server/**/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs };
