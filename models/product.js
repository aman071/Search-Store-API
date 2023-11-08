/*
A schema is needed for inserting as well as query data on Mongo.
*/
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'product name must be provided'],
  }, 
  price: {
    type: Number,
    required: [true, 'product price must be provided'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ['abc', 'bbb', 'premium', 'samsung', 'company', 'ikea', 
      'sony', 'arctic fox', 'sofacompany', 'passionRead', 'quirky', 'lg', 'fancycompany', 'bcd', 'manycompanies'], //ALLOWED values
      message: '{VALUE} is not supported',
    },
    // enum: ['ikea', 'liddy', 'caressa', 'marcos'],    
  },
})

module.exports = mongoose.model('Product', productSchema)
