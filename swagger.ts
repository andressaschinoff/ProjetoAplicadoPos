const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Feira na Mão',
    description: 'Description',
  },
  host: 'localhost:3001',
};

const swaggerFile = './swagger.json';
const routerFiles = ['./src/server.ts'];

swaggerAutogen(swaggerFile, routerFiles, doc).then(() => {
  require('./src/server');
});
