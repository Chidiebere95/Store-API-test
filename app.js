const express = require('express');
const app = express();
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const connect = require('./db/connect');
const productsRouter=require('./routes/products')
require('dotenv').config();
require('express-async-errors')

app.use(express.json()); 

app.use('/api/v1/products', productsRouter);

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 4000;

const start = async () => { 
  try {
    // Mongo connect
    await connect(process.env.MONGO_URI);
    console.log('connected to DB');
    app.listen(port, () => {
      console.log('App is listening on ' + port + '...');
    });
  } catch (error) {
    console.log(error);
  }
};
start();
