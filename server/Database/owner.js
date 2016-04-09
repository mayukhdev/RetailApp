var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  profile: {
    name: {
      type: String,
      required: true,
      lowercase: true
    },
    email: {
      type:String,
      required: true,
      match : /\S+@\S+\.\S+/
    },
    phone: {
      type : String,
      required : true
    },
    address:{
      type:String,
      required: true
    }
  }
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
