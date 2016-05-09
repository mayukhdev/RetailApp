app.directive('addToCart' , function() {
  return {
    controller: 'AddToCartController',
    templateUrl: '/templates/add_to_cart.html'
  };
});

app.directive('categoryProducts', function() {
  return {
    controller: 'CategoryProductsController',
    templateUrl: '/templates/category_products.html'
  }
});

app.directive('categoryTree', function() {
  return {
    controller: 'CategoryTreeController',
    templateUrl: '/templates/category_tree.html'
  }
});

app.directive('checkout' , function() {
  return {
    controller: 'CheckoutController',
    templateUrl: '/templates/checkout.html'
  };
});

app.directive('navBar', function() {
  return {
    controller: 'NavBarController',
    templateUrl: '/templates/nav_bar.html'
  };
});

app.directive('productDetails' , function() {
  return {
    controller: 'ProductDetailsController',
    templateUrl: '/templates/product_details.html'
  };
  });

app.directive('searchBar' , function() {
  return {
    controller: 'SearchBarController',
    templateUrl: '/templates/search_bar.html'
  };
});

app.directive('errorSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errorSrc) {
          attrs.$set('src', attrs.errorSrc);
        }
      });
    }
  }
});
