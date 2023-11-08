const express = require('express')

/* router is a mini Express appl, performs middleware and routing functions.
We would use a router like this to define a set of routes and middleware isolated from the main application. 
Once we've defined routes on this router object, we mount it on the main application using like app.use('/api', router);
express.Router() is used to create isolated sets of routes and middleware.
express() is used to create the main application which handles all routes and middleware for your server.
*/
const router = express.Router()                       //creating an instance of an express Router

const { getAllProducts, getAllProductsStatic} = require('../controllers/products')

router.route('/').get(getAllProducts)                 //controllers
router.route('/static').get(getAllProductsStatic)     //controllers

module.exports = router
