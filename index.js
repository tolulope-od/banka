/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';

// Set up the app with express
const app = express();
app.use(bodyParser({ extended: false }));
app.use(bodyParser.json());

/**
 * @route /test
 * @description use to test server response
 */
app.get('/test', (req, res) => res.status(200).json({ message: 'Response Returned Successfully' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));

export default app;
