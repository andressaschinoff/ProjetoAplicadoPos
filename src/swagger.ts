const swaggerAutogen = require('swagger-autogen')();

const swaggerFile = './swagger_output.json';
const routerFiles = ['./endpoints.js'];

swaggerAutogen(swaggerFile, routerFiles);
