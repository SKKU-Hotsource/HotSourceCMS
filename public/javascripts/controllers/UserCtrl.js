/*
* @author   : Do Hae Bin dhb0611
* @param    : controller
* @return   : no return
* @summary  :
*   A controller which is used in URL '/admin#/user'. (user_registry.html)
*   Shows the list of users.
*/

app.controller('UserCtrl',['$scope', '$http', 'Upload' ,'$routeParams' , '$sce', '$location', '$rootScope','$window', 'orderByFilter',  function($scope, $http, Upload, $routeParams, $sce, $location,$rootScope,$window, orderBy) {

$scope.itemsPerPage = 9;
$scope.currentPage = 0;


/*
* @author   : Do Hae Bin dhb0611
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to extrude list of all exisiting lists while enabling pagination setup simulatneously.
*   This function is called automatically once the page is loaded.
*/


$scope.userList = function(){

$http.get('/user').success(function(data){
       $scope.list = data;

    $scope.range = function() {
        var rangeSize = $scope.pageCount();
        var ret = [];
        var start;

        start = 0;
        if ( start > $scope.pageCount()-rangeSize ) {
          start = $scope.pageCount()-rangeSize+1;
        }

        for (var i=start; i<start+rangeSize; i++) {
          ret.push(i);
        }
        return ret;
      };

      $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
          $scope.currentPage--;
        }
      };

      $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0;
      };

      $scope.pageCount = function() {
        return Math.ceil(parseFloat($scope.list.length)/parseFloat($scope.itemsPerPage));
      };

      $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()-1) {
          $scope.currentPage++;
        }
      };

      $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.pageCount();
      };

      $scope.setPage = function(n) {
        $scope.currentPage = n;
      };
    });
 };
   
/*
* @author   : Do Hae Bin dhb0611
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to edit specific details of a specific user.
*   This function is called from the edit button in page.
*/


$scope.modify = function() {

    var data ={};
    data.user_id = $scope.selfId;
    if($scope.selfPassword)
        data.password = $scope.selfPassowrd;
    data.user_name = $scope.selfName;
    data.email = $scope.selfEmail;
    data.type = $scope.selfType;

    $http.put('/user/admin/' + $scope.selfId,data);
    $window.location.reload("/user/");
        
};

/*
* @author   : Do Hae Bin dhb0611
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to extrude specific details of a specific user.
*   This function is called as the modal opens in page.
*/

$scope.userInfor = function(user) {
            $scope.selfId=user.user_id;
            $scope.selfName=user.user_name;
            $scope.selfEmail=user.email;
            $scope.selfType=user.type.toString();
            $scope.userdata = [];
            $scope.userdata.push(user);
            
                       
    };


/*
* @author   : Do Hae Bin dhb0611
* @param    : int id and checked value.
* @return   : no return
* @summary  :
*   A function to enable a specific checkbox.
*   This function is called when the checkbox is clicked.
*/


    $scope.userChecked= [];
    $scope.checkedAll = false;


    $scope.checkItem = function(id, checked) {
        if (checked) {
            
            $scope.userChecked.push(id);
            
        
        } else {
            $scope.userChecked.pop();
        
        }
        
    };

/*
* @author   : Do Hae Bin dhb0611
* @param    : checked value.
* @return   : no return
* @summary  :
*   A function to enable all the checkboxes in the list.
*   This function is called when the checkAllBox is clicked.
*/


    $scope.checkAll = function(checked) {
        $scope.userChecked = [];

        angular.forEach($scope.list, function(value) {
            value.selected = checked;
            $scope.userChecked.push(value.user_id);

        });
        

        if (!checked) {
            $scope.userChecked = [];
        }
        
  
    };

/*
* @author   : Do Hae Bin dhb0611
* @param    : int id.
* @return   : no return
* @summary  :
*   A function to delete a specific user.
*   This function is called when the delete button is called upon.
*/
    
$scope.delete = function(id) {
        var cf = confirm("삭제하시겠습니까?")
        if(cf) {
            $http.delete('/user/' + $scope.selfId); 
            
        }
        $window.location.reload("/user/");
    };

/*
* @author   : Do Hae Bin dhb0611
* @param    : no parameter.
* @return   : no return
* @summary  :
*   A function to delete selected users in the list.
*   This function is called when the deleteSelect button is called upon.
*/
    


    $scope.deleteSelect=function() {
        var cf = confirm("삭제하시겠습니까") 
        if(cf) {
            for(var arrIndex in $scope.userChecked){
                var userId = $scope.userChecked[arrIndex];
                $http.delete('/user/' + userId);
            };

            $scope.list = $scope.list.filter(
                function(item) {
        
                    return !item.selected;
        
                });
        }
        $scope.userChecked = [];
        
    };

/*
* @author   : Do Hae Bin dhb0611
* @param    : contained file path.
* @return   : no return
* @summary  :
*   A function to align list in two different orders: up and down.
*   This function is called when the titles are called upon.
*/
   
  $scope.sortBy = function(orderProperty) {
    $scope.reverse = (orderProperty !== null && $scope.orderProperty === orderProperty)
    ? !$scope.reverse : false;
    $scope.orderProperty = orderProperty;
    $scope.list = orderBy($scope.list, $scope.orderProperty, $scope.reverse);
  };




}]);