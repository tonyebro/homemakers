angular.module('appRoutes', ["ui.router"])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider.state({
			name: 'home',
			url: '/',
			templateUrl: 'public/components/shop/templates/home.template',
			controller: 'HomeController'
		});
		$stateProvider.state({
			abstract : true,
			name: 'rental',
			url: '/rental',
			templateUrl: 'public/components/shop/templates/rental.template',
			controller: 'RentalController' , 
			params : {
				category : null
			},
			resolve: {
				inventory : function (Product, $sce) {
					return Product.find().$promise.then(function(data){
					var furniture = data;
				    var categories = [];
					for (var i = 0; i < furniture.length; i++){
						furniture[i].order_quantity = "1";
						var j = 0;
						do {
							if (furniture[i].category == categories[j]) {
								break;
							}
							if ((j == (categories.length-1)) || (categories.length==0)){
								categories.push(furniture[i].category);
							}
							j++;
						} while (j < categories.length);
					}
					return { 'products' : data, 'categories' : categories };
					});
				},
				category : function ($stateParams){
					return $stateParams.category;
				}
			}
		});
		$stateProvider.state({
			name: 'rental.all',
			url: '',
			templateUrl: 'public/components/shop/templates/rental.all.template',
			controller: 'RentalController'
		});
		$stateProvider.state({
			name: 'rental.product',
			url: '/product/:productID',
			templateUrl: 'public/components/shop/templates/product.template',
			controller: 'RentalController' 
		});
		$stateProvider.state({
			name: 'order',
			url: '/order',
			templateUrl: 'public/components/shop/templates/order.template',
			controller: 'OrderController' 
		});
		$stateProvider.state({
			name: 'contact',
			url: '/contact',
			templateUrl: 'public/components/shop/templates/contact.template',
			controller: 'ContactController' 
		});
		$stateProvider.state({
			name: 'edit',
			url: '/edit',
			templateUrl: 'public/components/shop/templates/edit.template',
			controller: 'EditController',
			resolve: {
				inventory : function (Product) {
					return Product.find();
				},
				
				currentProduct : function(){
					return null;
				}
			}
		});	
		$stateProvider.state({
			name: 'edit_product',
			url: '/edit/product/:productID',
			templateUrl: 'public/components/shop/templates/edit.product.template',
			controller: 'EditController',
			resolve: {
				currentProduct : function (Product, $stateParams) {
					return Product.findById({id : $stateParams.productID});
				},
				inventory : function(){
					return []
				}
			}
		});			
		$urlRouterProvider.otherwise('/');
	}]);