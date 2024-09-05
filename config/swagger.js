const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'My API',
          version: '1.0.0',
          description: 'API Documentation for My API',
        },
        servers: [
          {
            url: 'http://localhost:3000',
          },
        ],
      },
      apis: ['./routes/*.js'], // Chỉ định đường dẫn tới các file route của bạn
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
