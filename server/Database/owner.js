var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type:String,
      required: true,
      match : /\S+@\S+\.\S+/
    },
    phone: {
      type : String,
      required : true
    }
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
