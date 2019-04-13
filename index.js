import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import logger from 'morgan';
import Debug from 'debug';

import swaggerDoc from './swagger.json';

// Import routes
import authRoute from './server/routes/AuthRoute';
import accountRoute from './server/routes/AccountRoute';
import transactionRoute from './server/routes/TransactionRoute';

const { log } = console;
const debug = Debug('dev');

// Set up the app with express
const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = '/api/v1';

/**
 * @route /test
 * @description use to test server response
 */
app.get('/', (req, res) => res.status(200).json({ message: 'BANKA APP API RESPONSE SUCCESSFUL' }));

// logging middleware
app.use(logger('dev'));

// Body parser middleware
app.use(bodyParser({ extended: false }));
app.use(bodyParser.json());

// Use the routes for the apps routing logic
app.use(`${API_PREFIX}/auth`, authRoute);
app.use(`${API_PREFIX}/accounts`, accountRoute);
app.use(`${API_PREFIX}/transactions`, transactionRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Handle errors
app.use((err, req, res, next) => {
  log(err.stack);
  res.status(500).json({ error: err.message });
  next();
});

app.listen(PORT, () => debug(`Server Running on Port ${PORT}`));

export default app;
