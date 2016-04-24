var mongoose = require('mongoose');
var schema = require('./product').schema();

db = mongoose.connect('mongodb://localhost:27017/test');
Product = db.model('Product', schema, 'products');
Product.find({'internal.approximatePriceUSD' :  { "$exists" : true }})
.exec(function(error,products){
  if(error){
    console.error();
  }
  //prod = changeToINR(prod)
  var temp = [];
  for(var p in products){
    var j = products[p];
    var amt = Math.floor(j.price.amount * 67);
     j.internal.approximatePriceINR = amt
     j.price.amount = amt;
     j.price.currency = "INR";
     j.internal.approximatePriceUSD = undefined;
     temp.push(j);
  }
  addRemove(temp);
  //console.log(temp);
});

function addRemove(temp){
  Product.remove({}, function(error) {
      if(error) console.error();
    });
console.log(temp[0]);
  Product.create(temp,function(err){
    if(err) console.log(err);
    console.log("Added");
    db.disconnect();
  });
}
