/*
 * @author Kwak Jaeheon / jaehunny
 * @param $scope - angularjs, $http - for connection, $location - to get url, $routeParams - control id
 * @return $scope.res 
 * @summary read data from db and refine it 
 */
app.controller('HeaderController', function NavListController($scope, $http, $location, $routeParams) {
    var url = $location.$$url;
    url = url.split('/');
    id = url[url.length-1];
    category = url[url.length-3];
    var br=0;

    $scope.res = new Array();

    if(url[url.length-2] == "mypage" || url[url.length-1] == "mypage"){
      temp = new Object();
      temp.title = "Mypage";
      temp.id = "";
      temp.typeString = "mypage";
      $scope.res.push(temp);
    }
    else if(url[url.length-2] == "view"){
      $http.get("/board/post/"+category+"/"+id).success(
        function(data){id = data.CategoryId;
            $http.get("/category/sub")
      .then(function(response){
          res = response.data; 
          for(var i = 0; i < res[0].nodes.length; ++i){
            if(br==1) break;
            temp1 = new Object();
            temp1.title = res[0].nodes[i].title;
            temp1.type = res[0].nodes[i].type;
            temp1.typeString = res[0].nodes[i].typeString;
            temp1.id = res[0].nodes[i].id+"/list";
            if(res[0].nodes[i].id == id){
                $scope.res.push(temp1);
                br=1;
                break;
              }
            for(var j = 0; j < res[0].nodes[i].nodes.length; ++j){
              temp2 = new Object();
              temp2.title = res[0].nodes[i].nodes[j].title;
              temp2.type = res[0].nodes[i].nodes[j].type;
              temp2.typeString = res[0].nodes[i].nodes[j].typeString;
              temp2.id = res[0].nodes[i].nodes[j].id+"/list";
              if(res[0].nodes[i].nodes[j].id == id){
                $scope.res.push(temp1);
                $scope.res.push(temp2);
                j=res[0].nodes[i].nodes.length+1;
                br=1;
                break;
              }
              else{
                for(var k = 0; k < res[0].nodes[i].nodes[j].nodes.length; ++k){
                  temp3 = new Object();
                  temp3.title = res[0].nodes[i].nodes[j].nodes[k].title;
                  temp3.type = res[0].nodes[i].nodes[j].nodes[k].type;
                  temp3.typeString = res[0].nodes[i].nodes[j].nodes[k].typeString;
                  temp3.id = res[0].nodes[i].nodes[j].nodes[k].id+"/list";
                  if(res[0].nodes[i].nodes[j].nodes[k].id == id){
                    $scope.res.push(temp1);
                    $scope.res.push(temp2);
                    $scope.res.push(temp3);
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
            temp1 = new Object();
            temp1.title = res[0].nodes[i].title;
            temp1.type = res[0].nodes[i].type;
            temp1.typeString = res[0].nodes[i].typeString;
            temp1.id = res[0].nodes[i].id+"/list";
            if(res[0].nodes[i].id == id){
                $scope.res.push(temp1);
                br=1;
                break;
              }
            for(var j = 0; j < res[0].nodes[i].nodes.length; ++j){
              temp2 = new Object();
              temp2.title = res[0].nodes[i].nodes[j].title;
              temp2.type = res[0].nodes[i].nodes[j].type;
              temp2.typeString = res[0].nodes[i].nodes[j].typeString;
              temp2.id = res[0].nodes[i].nodes[j].id+"/list";
              if(res[0].nodes[i].nodes[j].id == id){
                $scope.res.push(temp1);
                $scope.res.push(temp2);
                j=res[0].nodes[i].nodes.length+1;
                br=1;
                break;
              }
              else{
                for(var k = 0; k < res[0].nodes[i].nodes[j].nodes.length; ++k){
                  temp3 = new Object();
                  temp3.title = res[0].nodes[i].nodes[j].nodes[k].title;
                  temp3.type = res[0].nodes[i].nodes[j].nodes[k].type;
                  temp3.typeString = res[0].nodes[i].nodes[j].nodes[k].typeString;
                  temp3.id = res[0].nodes[i].nodes[j].nodes[k].id+"/list";
                  if(res[0].nodes[i].nodes[j].nodes[k].id == id){
                    $scope.res.push(temp1);
                    $scope.res.push(temp2);
                    $scope.res.push(temp3);
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