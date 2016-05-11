var Category = require('./category');
var mongoose = require('mongoose');

module.exports = function(db) {
  var productSchema = {
    name: { type: String, required: true },
    pictures: [{ type: String}],
    price: {
      //Default is INR
      amount: {
        type: Number,
        required: true,
        set: function(v) {
          var div = 1.0;
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

  schema.index({ name: 'text' });

  var currencySymbols = {
    'USD': '$',
    'INR': '₹'
  };

  /*
   * Human-readable string form of price - "₹600" rather
   * than "600 INR"
   */
  schema.virtual('displayPrice').get(function() {
    return currencySymbols[this.price.currency] +
      '' + this.price.amount;
  });

  schema.set('toObject', { virtuals: true });
  schema.set('toJSON', { virtuals: true });
  return db.model('Product', schema, 'products');
};

module.exports.schema = function(){
  var productSchema = {
    name: { type: String, required: true },
    pictures: [{ type: String}],
    price: {
      //Default is INR
      amount: {
        type: Number,
        required: true,
        set: function(v) {
          var div = 1.0;

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

  schema.index({ name: 'text' });

  var currencySymbols = {
    'USD': '$',
    'INR': '₹'
  };

  /*
   * Human-readable string form of price - "₹600" rather
   * than "600 INR"
   */
  schema.virtual('displayPrice').get(function() {
    return currencySymbols[this.price.currency] +
      '' + this.price.amount;
  });

  schema.set('toObject', { virtuals: true });
  schema.set('toJSON', { virtuals: true });

  return schema;
};
