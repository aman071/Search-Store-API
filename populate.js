/*
Take products from products.json
Take schema from models/product.js
Add data to the mongodatabase
*/

require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () => {                   //Keep in mind that you can only use await inside an async func
  try {
    await connectDB(process.env.MONGO_URI)    //connect to mongodb
    await Product.deleteMany()                //delete existing records
    await Product.create(jsonProducts)        //add products from products.json. jsonProducts is an array
    console.log('Success!!!!')
    process.exit(0)                           //terminate process since work is done. 0 signifies all good
  } catch (error) {
    console.log(error)
    process.exit(1)                           //1 signifies error
  }
}

start()                                       //invoke the function. test using node populate.js
