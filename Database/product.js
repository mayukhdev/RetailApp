var Category = require('./category');
var mongoose = require('mongoose');

module.exports = function(db, fx) {
  var productSchema = {
    name: { type: String, required: true },
    pictures: [{ type: String}],
    price: {
      //Base Amount for openexchangerates is USD.
      amount: {
        type: Number,
        required: true,
        set: function(v) {
          if(this.price.currency==='INR'){
            this.internal.approximatePriceUSD =
              v * (fx()[this.price.currency] || 65);
          }
          this.internal.approximatePriceUSD =
            v / (fx()[this.price.currency] || 1);
          return v;
        }
      },
      // 4 supported currencies for now
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP','INR'],
        required: true,
        set: function(v) {
          if(v==='INR'){
            this.internal.approximatePriceUSD =
              this.price.amount * (fx()[v] || 65);
          }else{
          this.internal.approximatePriceUSD =
            this.price.amount / (fx()[v] || 1);
          }
          return v;
        }
      }
    },
    category: Category.categorySchema,
    internal: {
      approximatePriceUSD: Number
    }
  };

  var schema = new mongoose.Schema(productSchema);

  schema.index({ name: 'text' });

  var currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
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
