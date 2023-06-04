const connect = require('./db/connect');
const Product = require('./models/product');
const data = require('./products.json');
require('dotenv').config();
const axios = require('axios');
// console.log('data', data);
const start = async () => {
  try {
    const promiseVariable = await connect(process.env.MONGO_URI);
    // console.log('promiseVariable', promiseVariable);
    console.log('connected to db...');
    await Product.deleteMany();
    await Product.create(data);
    console.log('sucessful');
    // const { data } = await axios.get(
    //   'https://baconipsum.com/api/?type=meat-and-filler'
    // );
    // console.log(data);
    // console.log('hello world');
    // process.exit(0);
  } catch (error) {
    console.log('error here', error);
    // process.exit(1);
  }
};
start();
// process.exit(0);
