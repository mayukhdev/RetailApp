var mongoose = require('mongoose');
var Category = require('./test_category');
var fx = require('./test_fx');

var productSchema = {
  name: { type: String, required: true },
  // Pictures must start with "http://"
  pictures: [{ type: String}],
  price: {
    //Default is INR
    amount: {
      type: Number,
      required: true,
      set: function(v) {
        var div = 1.0;
        if(this.price.currency==='USD'){
          div = fx()['INR'];
        }
        this.internal.approximatePriceINR =
          v * div;
        return v;
      }
    },
    // Only 2 supported currencies for now
    currency: {
      type: String,
      enum: ['USD','INR'],
      required: true,
      set: function(v) {
        var div = 1.0;
        if(v==='USD'){
          div = fx()['INR'];
        }
        this.internal.approximatePriceINR =
          this.price.amount * div;
        return v;
      }
    }
  },
  category: Category.categorySchema,
  internal: {
    approximatePriceINR: Number
  }
};

var schema = new mongoose.Schema(productSchema);

var currencySymbols = {
  'USD': '$',
  'INR': '₹'
};

schema.virtual('displayPrice').get(function() {
  return currencySymbols[this.price.currency] +
    '' + this.price.amount;
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = schema;
module.exports.productSchema = productSchema;
