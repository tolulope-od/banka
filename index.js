import '@babel/polyfill';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import logger from 'morgan';
import Debug from 'debug';

import swaggerDoc from './swagger.json';

// Import route
import routes from './server/routes';

const debug = Debug('dev');

// Set up the app with express
const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = '/api/v1';

// Set up app to use Cross-Origin Resource Sharing
app.use(cors());

/**
 * @route /test
 * @description use to test server response
 */
app.get('/', (req, res) => res.status(200).json({ message: 'BANKA APP API RESPONSE SUCCESSFUL' }));

// logging middleware
app.use(logger('dev'));

// Body parser middleware
app.use(express({ extended: false }));
app.use(express.json());

// Use the routes for the apps routing logic
app.use(`${API_PREFIX}`, routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Handle errors
app.use((err, req, res, next) => {
  debug(err.stack);
  res.status(500).json({ error: "Something broke, don't worry, it's not you, it's us" });
  next();
});

app.get('*', (req, res) => {
  res.status(404).send({
    status: 404,
    error: 'Not found'
  });
});

app.listen(PORT, () => debug(`Server Running on Port ${PORT}`));

export default app;
