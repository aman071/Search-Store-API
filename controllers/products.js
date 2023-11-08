const Product = require('../models/product');                             //has the model schema for mongo

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort('price')
    .select('name price');      //chaining

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  /*
  Instead of passing req.query directly into Product.find(), better approach is 
  Destructure query object.
  Look at the fields present in query.
  Make a new queryObject using what exists in req query and is valid for us. For eg, don't take attributes which dont exist in schema.
  Also prevents injection attacks.
  */
  const { featured, company, name, sort, fields, numericFilters } = req.query;  //query obj is in URL, after '?'
  const queryObject = {};

  if (featured) { queryObject.featured = featured === 'true' ? true : false; }
  if (company)  { queryObject.company = company; }
  if (name)     { queryObject.name = { $regex: name, $options: 'i' }; } //options=i means case insensitive. pattern matching

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];            //numeric filters works only on numeric fields
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {              //checking if the field was numeric then add it to the query object
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');           //can add multiple sort fields, comma separated
    result = result.sort(sortList);                       //for mongo sort API it accepts space separated
  } else {
    result = result.sort('createdAt');                    //default sort
  }

  if (fields) {                                           //acts like select in mysql. list fields to show
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;                        //this logic shows appropriate entries on appropriate page

  result = result.skip(skip).limit(limit);  //4 pages, limit is 7
  // 23
  // 4 7 7 7 2

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
