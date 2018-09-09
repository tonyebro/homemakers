shop.controller('HomeController', ['$scope', function($scope) {
	$scope.baseUrl= "http://34.239.149.150:8080";
	var slides = ["stock2.jpg", "stock3.jpg", "stock4.jpg", "stock5.jpg", "stock6.jpg", "stock7.jpg"];
	var current_index = 0;
	$scope.curr_slide = slides[current_index];
	$scope.switch_slide = function(direction){
		if (direction){
			if (current_index == (slides.length-1)){
				current_index = 0;
			} else {
				current_index++;
			}
		} else {
			if (current_index == 0){
				current_index = slides.length-1;
			} else {
				current_index--;
			}
		}
		$scope.curr_slide = slides[current_index]
	};
}]);

shop.controller('RentalController', ['$scope', '$stateParams', 'orderDetails', 'Product', '$sce', '$state', 'inventory', 'category', function($scope, $stateParams, orderDetails, Product, $sce, $state, inventory, category) {
	var furniture_init = [{"product_id":"17048095-3f06-4b12-8745-efc8be7dbfde","name":"Cylinder Candle Holder","description":"Candle holder that is cyclinder","supplier":1,"supplier_product_id":"EUJWQK","category":"Candleholder","price":"5.00","cost":"4.00","image":"http://4db727875b0d4111a9049db23fb5d58c.vfs.cloud9.us-east-1.amazonaws.com:8081/media/products/crystal-candle-holders-500x500.jpg","quantity":5},{"product_id":"76892083-2f54-4a09-a088-5dde1a57d4f8","name":"Glass Candle Holder","description":"Tall candle holder made out of glass","supplier":1,"supplier_product_id":"JNIKWN","category":"Candleholder","price":"7.00","cost":"4.00","image":"http://4db727875b0d4111a9049db23fb5d58c.vfs.cloud9.us-east-1.amazonaws.com:8081/media/products/crystal_candle_holder_1.jpg","quantity":5},{"product_id":"b3b7ca0d-ae81-47f4-bffd-26a5da433e0e","name":"Round Candle Holder","description":"Spherical candleholder made from glass and metal","supplier":1,"supplier_product_id":"HUEJK","category":"Candleholder","price":"6.00","cost":"5.00","image":"http://4db727875b0d4111a9049db23fb5d58c.vfs.cloud9.us-east-1.amazonaws.com:8081/media/products/round_glass.jpg","quantity":5},{"product_id":"f244339e-c3e1-477b-a9d7-201ad23573f7","name":"Gold Pillar","description":"Medium sized gold pillar","supplier":1,"supplier_product_id":"UJLKFNJ","category":"Pillar","price":"15.00","cost":"7.00","image":"http://4db727875b0d4111a9049db23fb5d58c.vfs.cloud9.us-east-1.amazonaws.com:8081/media/products/gold_pillar.jpg","quantity":10}];
	
	var listToMatrix= [];
	var furniture= inventory.products;
	var product_per_row = 3;
	for (i = 0; i < furniture.length; i++){
		if (!(i % product_per_row)){
			listToMatrix.push([furniture[i]]);
		} else {
			listToMatrix[listToMatrix.length-1].push(furniture[i]);
		}
	}
	$scope.inventory = furniture;
	$scope.categories = inventory.categories;
	
	$scope.getImageUrl = function(imageUrl){
		var img = "http://34.239.149.150:8080/"+imageUrl;
		return img;
	};

	if ($stateParams.productID != null){
		var prod = Product.findById({ id : $stateParams.productID});
		$scope.product = prod;
	}
	

	$scope.updateProductFromCategory = function(category){
		var productlist = [];
		for (var i = 0; i < furniture.length; i++){
			if ((furniture[i].category != category) && category != "All") continue;
			productlist.push(furniture[i])
		}
		$scope.inventory = productlist;
	};
	
	if (category != null){
		$scope.updateProductFromCategory(category);
	}
		
	$scope.rerouteToProductCategory = function(category){
		$state.go('rental.all', {'category': category});
	};
	
	$scope.activeProducts = function(curr_category){
		if (category === curr_category) {
			return 'active';
		} else {
			return '';
		}
	}
	
	$scope.incQuantity = function(isIncrement){
		console.log($scope.product.order_quantity);
		if (isIncrement){
			$scope.order_quantity++;
		} else {
			if ($scope.order_quantity > 1){
				$scope.order_quantity--;
			}
		}
	}
	
	$scope.addToOrder = function(newProduct, order_quantity){
		var item = {
			"id" : newProduct.id,
			"name" : newProduct.name,
			"imgUrl" : "http://34.239.149.150:8080/"+newProduct.image,
			"price" : newProduct.price,
			"quantity" : order_quantity
		};
		orderDetails.addOrder(item);
	};
}]);

shop.controller('OrderController', ['$scope', 'orderDetails', function($scope, orderDetails){
	var order = orderDetails.getOrder();
	$scope.noItems = true;
	$scope.orderSent = false;
	$scope.total_cost = 0.00;
	if (order.length > 0){
		$scope.noItems = false;
		$scope.order_items = order;
		var total = 0.00
		for(var i = 0; i < order.length; i++){
			total += (order[i].price * order[i].quantity);
		}
		$scope.total_cost = total;
	} else {
		$scope.message = "You haven't ordered any items yet"
	}
	$scope.removeProduct = function(product){
		orderDetails.removeProduct(product.id);
		$scope.total_cost -= (product.price * product.quantity)
	}
	$scope.sendOrder = function(customer_name, customer_email, customer_phone){
		orderDetails.confirm(customer_name, customer_email, customer_phone).then(function(){
			orderDetails.clear();
		});
		$scope.orderSent = true;
	}
}]);

shop.controller('ContactController', ['$scope', '$window', function($scope, $window){
	
	$window.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat : 50.998, lng: -114.059},
            zoom: 4
    });
    var marker = new google.maps.Marker({position: {lat : 50.998, lng: -114.059}, map: $window.map});
}])

shop.controller('EditController', ['$scope', 'inventory', 'currentProduct', '$state', 'Product', function($scope, inventory, currentProduct, $state, Product){
	
	$scope.inventory = inventory;
	$scope.product = currentProduct;
	$scope.show_grid = true;
	var empty_product = {};
	$scope.new_products = [empty_product];
	$scope.getImageUrl = function(imageUrl){
		var img = "http://34.239.149.150:8080/"+imageUrl;
		return img;
	};
	
	$scope.deleteProduct = function(product_id){
		Product.deleteById({id : product_id}).$promise.then(function(){
			$state.reload();
		});
	}
	
	$scope.updateProduct = function(){
		Product.prototype$patchAttributes(
			{id : currentProduct.id},
			{name : $scope.product_name,
			description : $scope.product_descript,
			price : $scope.product_price,
			quantity : $scope.product_quantity}
		).$promise.then(function(){
			$state.reload();
		});
	}
}])