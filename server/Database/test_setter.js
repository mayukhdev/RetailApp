var mongoose = require('mongoose');
var productSchema = require('./test_product');

var Product = mongoose.model('Product', productSchema);

var p = new Product({
  name: 'test',
  price: {
    amount: 5,
    currency: 'INR'
  },
  category: {
    name: 'test'
  }
});

console.log(p.internal.approximatePriceINR); // 5

console.log(p.displayPrice);

p.price.amount = 100;
console.log(p.internal.approximatePriceINR); // 88

p.price.currency = 'USD';
console.log(p.internal.approximatePriceINR); // 80
p.price.amount = 11;
console.log(p.internal.approximatePriceINR); // 10
