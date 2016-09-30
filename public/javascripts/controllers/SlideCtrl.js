/*
* @author Jungheeyoon gmldbs3445
* @summary Get slides to show in mainpage 
*/    
app.controller('SlideCtrl',['$scope', '$http', function($scope, $http){
  $http.get("/slide").success(
    function(data){
      $scope.slidePosts = data;
      $scope.slidePosts = $scope.slidePosts.filter(
		function(item) {
			if(item.show == 1)	return 1	;
			else return 0;
		});

      var slides = [];
      for(var i = 0; i < Object.keys($scope.slidePosts).length; i++){
      	slides[i] = {order :i.toString()};
      }
      $scope.slides= slides;
  });
}]);    