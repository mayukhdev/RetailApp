var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  product_id: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Product'
  }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required:true
  },
  order_date: { type: Date, default: new Date() },
  cost : {type:Number,required:true},
  address: {type:String,required:true}
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
