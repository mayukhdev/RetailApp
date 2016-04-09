var mongoose = require('mongoose');

var orderSchema = {
  product_id: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Product'
  }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required:true
  },
  order_date: { type: Date, default: Date.now },
  cost : {type:Number,required:true}
};

module.exports = new mongoose.Schema(orderSchema);
module.exports.orderSchema = orderSchema;
