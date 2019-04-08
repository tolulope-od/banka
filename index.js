/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';

// Import routes
import authRoute from './server/routes/AuthRoute';
import accountRoute from './server/routes/AccountRoute';
import transactionRoute from './server/routes/TransactionRoute';

// Set up the app with express
const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = '/api/v1';

/**
 * @route /test
 * @description use to test server response
 */
app.get('/test', (req, res) => res.status(200).json({ message: 'Response Returned Successfully' }));

// Body parser middleware
app.use(bodyParser({ extended: false }));
app.use(bodyParser.json());

// Use the routes for the apps routing logic
app.use(`${API_PREFIX}/auth`, authRoute);
app.use(`${API_PREFIX}/accounts`, accountRoute);
app.use(`${API_PREFIX}/transactions`, transactionRoute);

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));

export default app;
