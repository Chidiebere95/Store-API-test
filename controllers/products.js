const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    // name: { $regex: 'bench', $options: 'i' },
    price: { $gt: 80 },
    rating: { $gt: 3 },
  });
  res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  try {
    // console.log(req.query);
    const { featured, company, name, sort, select, filters } = req.query;
    let queryObject = {};
    if (featured) {
      queryObject.featured = featured === 'true' ? true : false;
    }
    if (company) {
      queryObject.company = company;
    }
    if (name) {
      queryObject.name = { $regex: name, $options: 'i' };
    }
    if (filters) {
      const val = filters || 'price>0';
      const target = { price: { $gt: 80 }, rating: { $gt: 3 } };
      const obj = {};
      const current = 'price-$gt-80,rating-$gt-3';
      const options = ['price', 'rating'];
      const numericOperators = {
        '<': '$lt',
        '<=': '$lte',
        '=': '$eq',
        '>': '$gt',
        '>=': '$gte',
      };

      const regex = /\b(<|<=|=|>|>=)\b/g;
      const replacedFilters = val.replace(regex, (match) => {
        return `-${numericOperators[match]}-`;
      });

      // console.log(replacedFilters);
      const arrayOfReplacedFilters = replacedFilters.split(',');
      arrayOfReplacedFilters.forEach((item) => {
        const itemSplitted = item.split('-');
        const [property, operator, value] = itemSplitted;
        if (options.includes(property)) {
          console.log(obj);
          obj[property] = { [operator]: Number(value) };
        }
      });

      // console.log(obj);
      queryObject = { ...queryObject, ...obj };

      // const filtersMain = filters.replace(regex, (match) => {
      //   return `-${numericOperators[match]}-`;
      // });
      // const options = ['price', 'rating'];
      // console.log(filters);
      // console.log(filtersMain);
      // const val2 = filtersMain.split(',').forEach((item) => {
      //   const [field, operator, value] = item.split('-');
      //   if (options.includes(field)) {
      //     queryObject[field] = { [operator]: Number(value) };
      //   }
      // });
    }
    console.log('queryobject', queryObject);
    let result = Product.find(queryObject);
    if (sort) {
      let sortData = sort.split(',').join(' ');
      // result = Product.find(queryObject).sort(sortData);
      result = result.sort(sortData);
    } else {
      // result = Product.find(queryObject).sort('createdAt);
      result = result.sort('createdAt');
    }
    if (select) {
      const selectData = select.split(',').join(' ');
      result = result.select(selectData);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    result = result.limit(limit).skip((page - 1) * limit);

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
    // console.log(queryObject);
    // const products = await Product.find(queryObject);
    // res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = { getAllProducts, getAllProductsStatic };
