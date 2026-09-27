import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Inventory Management API',
    description: 'Automatically reverse-engineered Express API documentation.',
  },
  host: 'localhost:3001',
  schemes: ['http'],
};

const outputFile = './src/swagger-output.json';
// Scans index.js and all files inside the routes folder under src
const endpointsFiles = [
  './src/index.js',
  './src/routes/*.js'
];

swaggerAutogen({ modulesFormat: 'esm' })(outputFile, endpointsFiles, doc);
