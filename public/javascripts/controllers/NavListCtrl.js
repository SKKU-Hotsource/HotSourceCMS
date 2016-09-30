/*
 * @author Kwak Jaeheon / jaehunny
 * @param $scope - angularjs, $http - for connection
 * @return $scope.navList
 * @summary send top-end navigation's data
 */

app.controller('NavListController', function NavListController($scope, $http) {

    $http.get("/category/sub")
      .then(function(response){
         res = response.data;
         $scope.navList = res[0].nodes;
      });

});