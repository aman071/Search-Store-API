require('dotenv').config();                                           //to access env variables
/*
if async returns errors, normally we would try-catch it to avoid app break down
this module allows handling of those errors without try catch. We can throw errors and have it in our err object
in the callback.
*/
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');                           //to connect with mongo
const productsRouter = require('./routes/products');

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

// middleware. This tells Express to expect JSON data in the req body and parse it 
// so that we can access it in route handlers.
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use('/api/v1/products', productsRouter);                        //router controller
app.use(notFoundMiddleware);                                        //middleware to handle unknown routes/routes not set up
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
