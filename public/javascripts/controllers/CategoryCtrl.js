/*
* @author : 강성필 hwhale
* @param  : controller
* @return : no return
* @summary  :
* A controller which is used in URL '/admin#/category'. (edit_category.html)
* Shows the list of popups.
*/
app.controller('categoryCtrl', ['$scope', '$http',function ($scope, $http) {

	/*
	* @author : 강성필 hwhale
	* @param  : no parameter
	* @return : no return
	* @summary  :
	*	Get the data of all categories from the server to show.
	*/
	$scope.typeList = [];
	$http.get("/category/typelist").then(function(res) {
		$scope.typeList = res.data;
		$scope.addNode = { title: null, type: 1 };
	});
	$http.get("/category/sub").then(function(response){
		$scope.tree = response.data;
	});
	
	/*
	* @author : 강성필 hwhale
	* @param  : object node / a category node you want to delete in the category tree.
	* @return : no return
	* @summary  :
	*	Remove the category node. It is binded with the delete button.
	*/
	$scope.remove = function (node) {
		node.remove();
	};

	/*
	* @author : 강성필 hwhale
	* @param  : object node / a category node you want to show or hide its child nodes.
	* @return : no return
	* @summary  :
	*	Show or hide the node's child you input in the parameter. It is binded with the toggle button.
	*/
	$scope.toggle = function (node) {
		node.toggle();
	};

	/*
	* @author : 강성필 hwhale
	* @param  : int typeIndex / an integer which specify the type you want to
	* @return : no return
	* @summary  :
	*	Set the type of the new category. It is used in the modal.
	*/
	$scope.setType = function (typeIndex) {
		$scope.addNode.type = typeIndex;
	};

	/*
	* @author : 강성필 hwhale
	* @param  : object parentNode / an object you want to made new node be a child of it.
	* @return : no return
	* @summary  :
	*	Set the parent node of an existing node. 
	*	It is used in the button which adds new node in the existing node.
	*/
	$scope.setParentNode = function (parentNode) {
		$scope.parentNode = parentNode.$modelValue;
	};

	/*
	* @author : 강성필 hwhale
	* @param  : no paremeter
	* @return : no return
	* @summary  :
	*	Set the parent node of a node as the virtual superior node(root node).
	*	It is used in the button which adds the superior node which admin can control.
	*/
	$scope.setSuperNode = function () {
		$scope.parentNode = $scope.tree[0];
	};

	/*
	* @author : 강성필 hwhale
	* @param  : no parameter
	* @return : no return
	* @summary  :
	*	Add the new category in tree which exists only in client.
	*	It does not change the status of category in the server.
	*/
	$scope.addCategory = function () {
		$scope.parentNode.nodes.push({
			id: null,
			title: $scope.addNode.title,
			type: $scope.addNode.type,
			nodes: [],
			sequence: 0
		});
		$scope.addNode = { title: null, type: 1 };
	}

	/*
	* @author : 강성필 hwhale
	* @param  : no parameter.
	* @return : no return
	* @summary  :
	*	It hides all the child categories. You can only see the superior nodes.
	*/
	$scope.collapseAll = function () {
		$scope.$broadcast('angular-ui-tree:collapse-all');
	};

	/*
	* @author : 강성필 hwhale
	* @param  : no parameter
	* @return : no return
	* @summary  :
	*	It shows all the child categorys.
	*/
	$scope.expandAll = function () {
		$scope.$broadcast('angular-ui-tree:expand-all');
	};

	/*
	* @author : 강성필 hwhale
	* @param  : no parameter
	* @return : no return
	* @summary  :
	*	Save the current node state in the client to the server.
	*/
	$scope.save = function () {
		console.log($scope.tree[0]);
		$http.put("/category/sub", $scope.tree[0]).success( function(res) {
			if( res.error ) {
				alert("오류가 발생했습니다. 다시 시도해주세요");
				return;
			}
			alert("변경된 카테고리를 저장하였습니다.");
			window.location.reload(true);
		});
	}
}]);


 


/*
 * @author Kwak Jaeheon / jaehunny
 * @summary simple controllers for main admin page
 */
app.controller('HeaderController', function NavListController($scope, $http) {
	$scope.res = 
	{
		"lev1":"Admin",
		"id1":"/admin"
	};

});

/*
 * @author Kwak Jaeheon / jaehunny
 * @param $scope - angularjs, $http - for connection, $location - to get url
 * @return $scope.res 
 * @summary read data from db and refine it for admin's category manage
 */
 app.controller('SubNavController', function NavListController($scope, $http, $location) {

 	$scope.res = new Array();
 	$http.get("/category/sub").then(function(response){
 		res = response.data; 
 		for(var i = 0; i < res[0].nodes.length; ++i){
 			temp1 = new Object();
 			temp1.title = res[0].nodes[i].title;
 			temp1.type = res[0].nodes[i].type;
			temp1.typeString = res[0].nodes[i].typeString;
 			temp1.id = res[0].nodes[i].id;
 			$scope.res.push(temp1);

 			for(var j = 0; j < res[0].nodes[i].nodes.length; ++j){
 				temp2 = new Object();
 				temp2.title = "- "+res[0].nodes[i].nodes[j].title;
 				temp2.type = res[0].nodes[i].nodes[j].type;
				temp2.typeString = res[0].nodes[i].nodes[j].typeString;
 				temp2.id = res[0].nodes[i].nodes[j].id;

 				$scope.res.push(temp2);

 				for(var k = 0; k < res[0].nodes[i].nodes[j].nodes.length; ++k){
 					temp3 = new Object();
 					temp3.title = "- - "+res[0].nodes[i].nodes[j].nodes[k].title;
 					temp3.type = res[0].nodes[i].nodes[j].nodes[k].type;
					temp3.typeString = res[0].nodes[i].nodes[j].nodes[k].typeString;
 					temp3.id = res[0].nodes[i].nodes[j].nodes[k].id;
 					$scope.res.push(temp3);
 				}
 			}
 		}
 	});
 });