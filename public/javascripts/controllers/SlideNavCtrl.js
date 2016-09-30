/*
 * @author Kwak Jaeheon / jaehunny
 * @param $scope - angularjs, $http - for, $location - to get url, $routeParams - control id
 * @return $scope.titlenow, $scope.lists, $scope.idnow
 * @summary control sidenav of board pages (view, list), detect which page is loaded now, and drop down it automatically
 */

app.controller('SlideNavController', function NavListController($scope, $http, $routeParams, $location) {
  var url = $location.$$url;
    url = url.split('/');
    id = url[url.length-1];
    category = url[url.length-3];
    var br=0;

    if(url[url.length-2] == "view"){
      $http.get("/board/post/"+category+"/"+id).success(
        function(data){id = data.CategoryId;
            $http.get("/category/sub")
      .then(function(response){
          res = response.data; 
          for(var i = 0; i < res[0].nodes.length; ++i){
            if(br==1) break;
            $scope.titlenow=res[0].nodes[i].title;
            if(res[0].nodes[i].id == id){
                $scope.lists = res[0].nodes[i].nodes;
                $scope.idnow = res[0].nodes[i].id;
                j=res[0].nodes[i].nodes.length+1;
                br=1;
                break;
              }
            for(var j = 0; j < res[0].nodes[i].nodes.length; ++j){
              if(res[0].nodes[i].nodes[j].id == id){
                $scope.lists = res[0].nodes[i].nodes;
                $scope.idnow = res[0].nodes[i].nodes[j].id;
                j=res[0].nodes[i].nodes.length+1;
                br=1;
                break;
              }
              else{
                for(var k = 0; k < res[0].nodes[i].nodes[j].nodes.length; ++k){
                  if(res[0].nodes[i].nodes[j].nodes[k].id == id){
                    $scope.lists = res[0].nodes[i].nodes;
                    k=res[0].nodes[i].nodes[j].length+1;
                    $scope.idnow = res[0].nodes[i].nodes[j].id;
                    br=1;
                    break;
                  }
                }
              }
            }
          }
      });}
      )
    }
    else{
        id = url[url.length-2];
    $http.get("/category/sub")
      .then(function(response){
          res = response.data; 
          for(var i = 0; i < res[0].nodes.length; ++i){
            if(br==1) break;
            $scope.titlenow=res[0].nodes[i].title;
            if(res[0].nodes[i].id == id){
                $scope.lists = res[0].nodes[i].nodes;
                $scope.idnow = res[0].nodes[i].id;
                j=res[0].nodes[i].nodes.length+1;
                br=1;
                break;
              }
            for(var j = 0; j < res[0].nodes[i].nodes.length; ++j){
              if(res[0].nodes[i].nodes[j].id == id){
                $scope.lists = res[0].nodes[i].nodes;
                $scope.idnow = res[0].nodes[i].nodes[j].id;
                j=res[0].nodes[i].nodes.length+1;
                br=1;
                break;
              }
              else{
                for(var k = 0; k < res[0].nodes[i].nodes[j].nodes.length; ++k){
                  if(res[0].nodes[i].nodes[j].nodes[k].id == id){
                    $scope.lists = res[0].nodes[i].nodes;
                    k=res[0].nodes[i].nodes[j].length+1;
                    $scope.idnow = res[0].nodes[i].nodes[j].id;
                    br=1;
                    break;
                  }
                }
              }
            }
          }
      });
    }
});