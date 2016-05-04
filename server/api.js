var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var fs = require('fs');

/* Checkout with COD  */

module.exports = function(wagner,key) {
  var api = express.Router();

  api.use(bodyparser.json());

  /* Owner API */
  //test
  key = "123";

  api.post('/owner/insert/product', wagner.invoke(function(Product,Category){
    return function(req,res){

      if(req.body.key !== key){
        return res.
          status(status.UNAUTHORIZED). //401
          json({ error: error.toString() });
      }

      var name = req.body.name;
      var price = Number(req.body.price);

      Category.findOne({_id:req.body.category},function(error, category) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR). //500
            json({ error: error.toString() });
        }
        if (!category) {
          return res.
            status(status.NOT_FOUND). //404
            json({ error: 'Not found' });
        }
        //console.log(category);
        var product = new Product({
          name:name,
          category : category,
          pictures:[req.body.pic],
          price : {
            amount: price,
            currency: 'INR'
          }
        });
        //console.log(product);
        product.save(function(err){
          if (err) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: err.toString() });
          }
        });
      });

    };
  }));

  api.post('/owner/insert/category', wagner.invoke(function(Category) {
    return function(req, res) {
      if(req.body.key !== key){
        return res.
          status(status.UNAUTHORIZED). //500
          json({ error: error.toString() });
      }

      Category.findOne({ _id: req.body.id }, function(error, category) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR). //500
            json({ error: error.toString() });
        }
        if (!category) {
           var ancestors = [];
           ancestors.push(req.body.id);
           if(req.body.parent !== undefined){
            var parent_id = req.body.parent;
            ancestors.push(parent_id);
            while(parent_id) {
              Category.find({'_id':parent_id},function(error,category){
                if(error){console.log("category error");}
                  try{
                    ancestors.push(category.parent);
                  } catch(e){
                    parent_id = undefined;
                    var category = new Category({
                      _id : req.body.id,
                      parent : req.body.parent,
                      ancestors : ancestors
                    });
                    category.save(function(err) {
                      if(err){
                        return res.
                          status(status.INTERNAL_SERVER_ERROR). //500
                          json({ error: error.toString() });
                      }
                    });
                  }
              });
            }
          } else{
            var category = new Category({
              _id : req.body.id,
              ancestors : ancestors
            });
            category.save(function(err) {
              if(err){
                return res.
                  status(status.INTERNAL_SERVER_ERROR). //500
                  json({ error: error.toString() });
              }
            });
          }

        }
      });
    };
  }));

  api.get('/owner/details', wagner.invoke(function(Owner) {
    return function(req,res) {
      Owner.findOne({}, function(error, owner) {
        if(error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR). //500
            json({ error: error.toString() });
        }
        res.json({ owner : owner });
      });
    };
  }));

  /* Category API */
  api.get('/category/id/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.findOne({ _id: req.params.id }, function(error, category) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR). //500
            json({ error: error.toString() });
        }
        if (!category) {
          return res.
            status(status.NOT_FOUND). //404
            json({ error: 'Not found' });
        }
        res.json({ category: category });
      });
    };
  }));

  api.get('/category/parent/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.
        find({ parent: req.params.id }).
        sort({ _id: 1 }).
        exec(function(error, categories) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ categories: categories });
        });
    };
  }));

  api.get('/category/all', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.
        find({}).
        exec(function(error, categories) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ categories: categories });
        });
    };
  }));

  /* Product API */
  api.get('/product/id/:id', wagner.invoke(function(Product) {
    return function(req, res) {
      Product.findOne({ _id: req.params.id },
        handleOne.bind(null, 'product', res));
    };
  }));

  api.get('/product/category/:id', wagner.invoke(function(Product) {
    return function(req, res) {
      var sort = { name: 1 };
      if (req.query.price === "1") {
        sort = { 'internal.approximatePriceINR': 1 };
      } else if (req.query.price === "-1") {
        sort = { 'internal.approximatePriceINR': -1 };
      }

      Product.
        find({ 'category.ancestors': req.params.id }).
        sort(sort).
        exec(handleMany.bind(null, 'products', res));
    };
  }));

  /* User API */
  api.put('/me/cart', wagner.invoke(function(User) {
    return function(req, res) {
      try {
        var cart = req.body.data.cart;
      } catch(e) {
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'No cart specified!' });
      }


        req.user.data.cart = cart;

      req.user.save(function(error, user) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        return res.json({ user: user });
      });
    };
  }));

  api.get('/me', function(req, res) {
    if (!req.user) {
      return res.
        status(status.UNAUTHORIZED).
        json({ error: 'Not logged in' });
    }

    req.user.populate({ path: 'data.cart.product', model: 'Product' }
                            , handleOne.bind(null, 'user', res));
  });

  /* Checkout API */
  api.post('/checkout', wagner.invoke(function(User,Order,ownerMail,mailgunApi
    ,mailgunDomain,mailgunFrom) {
    return function(req, res) {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json({ error: 'Not logged in' });
      }

      // Populate the products in the user's cart
      req.user.populate({ path: 'data.cart.product', model: 'Product' }
                        ,function(error, user) {

        var ProductMail = "";


        // Sum up the total price in INR
        var totalCostINR = 0;
        _.each(user.data.cart, function(item) {
          totalCostINR += item.product.internal.approximatePriceINR *
            item.quantity;
        });

        var userAddress = req.body.address;
        var userPhone = req.body.phone;
        if(user.data.cart.length==0 || userAddress==undefined || userPhone==undefined){
          return false;
        }


        var prod = [];
        _.each(user.data.cart, function(item) {
          for(var i = 0; i < item.quantity;i++){
              prod.push(item.product._id);
              //prod.push(item.product);
          }
        });

        _.each(user.data.cart, function(item) {
          for(var i = 0; i < item.quantity;i++){
              ProductMail += item.product.name  + "\nCost:" + item.product.internal.approximatePriceINR + "\n\n";
          }
        });

        ProductMail += "Total Cost: " + totalCostINR + "\n";
        ProductMail +=  "\nUser Email: " + user.profile.username + "\n";
        ProductMail +=  "User Phone: " + userPhone + "\n";
        ProductMail += "User Address:\n\n" + userAddress + "\n\n";


        req.user.data.cart = [];

        var ord = {};
        ord.user_id = user._id;
        ord.product_id = prod;
        ord.cost = totalCostINR;
        ord.address = userAddress;
        // ord.user_id = user;
        // ord.product_id = prod;
        // ord.cost = totalCostINR;
        // ord.address = userAddress;


        var order = new Order(ord);
        order.save(function(err){
          if(err){
            return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
          };
           Order.find().populate('user_id').populate('product_id').exec(function(err,data) {});
             ProductMail+= "Order ID: " + order._id.toString();
             //console.log(ProductMail);
             var api_key = mailgunApi;
              var domain = mailgunDomain;
              var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

              var sub = 'Order by: ' + user.profile.username + ' At: ' + order.order_date;

              var data = {
                from: mailgunFrom,
                to: ownerMail,
                subject: sub,
                text: ProductMail
              };

              mailgun.messages().send(data, function (error, body) {});

        });


      req.user.data.cart = [];
      req.user.save(function() {
        return res.json({});
      });

        //Print here without order id.
        //console.log('Here'+ ProductMail);


      });
    };
  }));

  /* text search API */
  api.get('/product/text/:query', wagner.invoke(function(Product) {
    return function(req, res) {
      Product.
        find(
          { $text : { $search : req.params.query } },
          { score : { $meta: 'textScore' } }).
        sort({ score: { $meta : 'textScore' } }).
        limit(10).
        exec(handleMany.bind(null, 'products', res));
    };
  }));

  return api;
};

function handleOne(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if (!result) {
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Not found' });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}

function handleMany(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}
