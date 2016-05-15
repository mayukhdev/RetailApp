var api_link = '/api/v1';
// var api_link = (function getApiKey(){
//   return '/api/v1/' + require('fs').readfile('./server/key','utf8',function(err,data){
//     if(err) console.error(err);
//     console.log(data);
//     return data;
//   });
// })()


app.controller('AddToCartController', function($scope, $http, $user, $timeout) {
  $scope.canAdd = true;
  $scope.addToCart = function(product) {
    var num = 0;
    for(var i=0;i<$user.user.data.cart.length;i++) {
        for(var j=0;j < $user.user.data.cart[i].quantity;j++){
          num += 1;
        }
    }
    if(num >= 9){
      $scope.canAdd = false;
    }
    if ($scope.canAdd) {
      var obj = { product: product._id, quantity: 1 };

      $user.user.data.cart.push(obj);
      var link_cart = api_link + '/me/cart';

      $http.
        put(link_cart, { data: { cart: $user.user.data.cart } }).
        success(function(data) {
          $user.loadUser();
          $scope.success = true;
        });
    }
  };
});

app.controller('CategoryProductsController' , function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.category);

  $scope.price = undefined;

  $scope.handlePriceClick = function() {
    if ($scope.price === undefined) {
      $scope.price = -1;
    } else {
      $scope.price = 0 - $scope.price;
    }
    $scope.load();
  };

  $scope.load = function() {
    var queryParams = { price: $scope.price };
    var link = api_link + '/product/category/';
    $http.
      get(link + encoded, { params: queryParams }).
      success(function(data) {
        $scope.products = data.products;
      });
  };

  $scope.load();
});

app.controller('CategoryTreeController' , function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.category);
  var link_id = api_link + '/category/id/';
  var link_parent = api_link + '/category/parent/';
  $http.
    get(link_id + encoded).
    success(function(data) {
      $scope.category = data.category;
      $http.
        get(link_parent + encoded).
        success(function(data) {
          $scope.children = data.categories;
        });
    });

});

app.controller('CheckoutController' ,function($scope, $user, $http) {
  $scope.user = $user;
  $scope.toShow = false;
  $scope.canAdd = true;
  //Display Show message
  $scope.displayUpdate = function(){
    $scope.toShow = true;
  };

  //Removing Product
  $scope.removeProduct = function(item){
    for(var i=0;i<$user.user.data.cart.length;i++){
      if($user.user.data.cart[i]==item){
        $user.user.data.cart.pop(i);
      }
    }
    $scope.updateCart();
  }
  // For update cart

  var link = api_link + '/me/cart';
  $scope.updateCart = function() {

    $http.
      put(link, $user.user).then(
      function successCallback(data) {
        $scope.updated = true;
        $scope.toShow = false;
      },function errorCallback(response) {
          console.log(response);
          $scope.canAdd = false;
      });
  };

  // For checkout

  $scope.checkout = function() {
    $scope.error = null;
    var address = $scope.userAddress;
    var phone = $scope.userPhone.replace(/\s/g,"");
    var phoneno = /^\+?([0-9]{2})\)?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if(phone.match(phoneno)){
      $scope.error = null;
    }else{
      $scope.error = "Enter Correct Phone Number";
    }

    if($scope.error === null){
      var link = api_link + '/checkout';
      $scope.updateCart();
      $http.
        post(link,{address: address,phone:phone}).
        success(function(data) {
          $scope.checkedOut = true;
          $user.user.data.cart = [];
          $scope.userAddress = "";
          $scope.userPhone = "";
      });
    }
  };
});

app.controller('NavBarController' , function($scope, $user, $http,$window) {
  $scope.user = $user;
  $scope.logout = function(){
    $http.get('/logout').success(function(data){
      $window.location.reload();
    });
  }
});

app.controller('ProductDetailsController', function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.id);
  var link = api_link + '/product/id/';
  $http.
    get(link + encoded).
    success(function(data) {
      $scope.product = data.product;
    });
});

app.controller('SearchBarController' , function($scope, $http) {
 $scope.showCat = true;
 var category_url =  api_link + '/category/all';
 $http.get(category_url).success(function(data){
   //$scope.category_list = data.categories;
   $scope.category_list = [];
   for(var i of data.categories){
     if (!i.hasOwnProperty('parent')){
       $scope.category_list.push(i);
     }
   }
 });
 //console.log($scope.category_list);
 $scope.update = function() {
   //$scope.showCat = false;
   var encoded = encodeURIComponent($scope.searchText);
   $scope.input = $scope.searchText;
   var url =  api_link + '/product/text/'+ encoded;
   $http.get(url).success(function(data){
     $scope.results = data.products;
    // $scope.category_link += $scope.results.category['_id'];
   });
 };
 //$scope.getCategory = function() {
   //$scope.category_link = '#/category/';
 //};
});

ins.controller("ProductInsertController",function($scope,$http){
  var category_url =  api_link + '/category/all';
  $scope.canSubmit = false;
  $scope.inserted = false;
  $http.get(category_url).success(function(data) {
    $scope.categories = data.categories;
  });
  $scope.submitCheck = function(){
    if($scope.apikey && $scope.productname && $scope.pictureurl && $scope.cost && $scope.cat){
      $scope.canSubmit = true;
    }
  };

  $scope.submit = function(){
    //console.log("submit");
    if($scope.apikey && $scope.productname && $scope.pictureurl && $scope.cost && $scope.cat){
      var link = api_link + '/owner/insert/product';
      var values = {
        key : $scope.apikey,
        name :  $scope.productname,
        pic : $scope.pictureurl,
        price : $scope.cost,
        category : $scope.cat
      }
      //console.log(values);
      $http.
        post(link,values).
        success(function(data) {
          $scope.inserted = true;
          $scope.apikey = "";
          $scope.productname = "";
          $scope.pictureurl = "";
          $scope.cost = "";
          $scope.cat = "";
      });
    }
  }

});
