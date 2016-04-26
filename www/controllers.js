var api_link = '/api/v1';
// var api_link = (function getApiKey(){
//   return '/api/v1/' + require('fs').readfile('./server/key','utf8',function(err,data){
//     if(err) console.error(err);
//     console.log(data);
//     return data;
//   });
// })()

//TODO: remove stripe and fx.

app.controller('AddToCartController', function($scope, $http, $user, $timeout) {
  $scope.addToCart = function(product) {
    var obj = { product: product._id, quantity: 1 };
    $user.user.data.cart.push(obj);
    var link_cart = api_link + '/me/cart';
    $http.
      put(link_cart, { data: { cart: $user.user.data.cart } }).
      success(function(data) {
        $user.loadUser();
        $scope.success = true;

      //   $timeout(function() {
      //     $scope.success = false;
      //   }, 5000);
      });
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
      put(link, $user.user).
      success(function(data) {
        $scope.updated = true;
      });
  };

  // For checkout

  $scope.checkout = function() {
    $scope.error = null;
    var address = $scope.userAddress;
      var link = api_link + '/checkout';
      $scope.updateCart();
      $http.
        post(link,{address: address }).
        success(function(data) {
          $scope.checkedOut = true;
          $user.user.data.cart = [];
          $scope.address = "";
      });
  };
});

app.controller('NavBarController' , function($scope, $user) {
  $scope.user = $user;
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
