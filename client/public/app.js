'use strict'

var shop = angular.module("shop", []);

shop.config(['$httpProvider', function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];   
}]);

angular.module('HomemakersApp', ['ngResource',
	'appRoutes',
	'shop',
	'lbServices'
	]).config(function(LoopBackResourceProvider){
	    LoopBackResourceProvider.setAuthHeader('X-Access-Token');
	    LoopBackResourceProvider.setUrlBase('http://34.239.149.150:8080/api');
	});

shop.factory('orderDetails',['$http', 'Order', orderDetails]);

function orderDetails($http, Order) {
    var orderDetails = [];
    
    return {
        getOrder : function() {
            return orderDetails;
        },
        
        addOrder : function(newProduct) {
            var productFound = false;
            for (var i = 0; i < orderDetails.length; i++){
                if (newProduct.id === orderDetails[i].id){
                    orderDetails[i].quantity = orderDetails[i].quantity + newProduct.quantity;
                    productFound = true;
                    break;
                }
            }
            if (!productFound){
                orderDetails.push(newProduct);
            }
        },
        
        confirm : function(client_name, client_email, client_phone) {
;;
            var new_order = Order.create({customer_name : client_name, customer_email : client_email,
                customer_phone : client_phone, productList : []}).$promise;
            new_order.then(function(order){
                for (var i = 0; i < orderDetails.length; i++){
                    Order.products.create({id: order.id}, {productId : orderDetails[i].id, quantity : orderDetails[i].quantity,
                       orderId : order.id });
                }                    
            });
            return new_order;
        },
        
        removeProduct : function(product_id){
            for (var i = 0; i < orderDetails.length; i++){
                if (product_id === orderDetails[i].id){
                    orderDetails.splice(i, 1)
                    break;
                }
            }            
        },
        
        clear : function(){
            orderDetails = [];
        }
    }
};


shop.factory('ProductService', ['$http', function($http){
    var productData;
    
    return {
        getProducts : function() {
            return productData;
        },
        
        getProduct : function(id){
            if (productData) return productData[id];
            else 0
        },
        
        updateProducts : function(baseUrl) {
            return $http({
                method : 'GET',
                url : baseUrl,
                headers : '{"Content-Type": "application/json"}',
                withCredentials : true
                }).then(function (response){
                productData = response.data;
                return response.data;
            });
            
        },
        
        getProductCategory : function(category) {
    		var productDataFromCategory = [];
    		for (var i = 0; i < productData.length; i++){
    			if ((productData[i].category == category) || category == "All") {
    			    productDataFromCategory.push([productData[i]]);
    			}
    		}
    		return productDataFromCategory;
		}
    }
    
}]);
