app.controller('BoardCtrl',['$scope', '$http', 'Upload' ,'$routeParams' , '$sce', '$location', '$rootScope','$window', 'orderByFilter',  function($scope, $http, Upload, $routeParams, $sce, $location,$rootScope,$window,orderBy) {

  $scope.itemsPerPage = 9;
  $scope.currentPage = 0;

/*
* @author   : Oh taek kyung wjk751
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to check the type of url. If type and category are not correspond url is banned.
*   This function is called automatically once the page is loaded.
*/

function typeCheck(){
  var url_path = $location.path();
  var array = url_path.split('/');
  var path_array = array[1];
  var category_array = array[2];
  
  $http({method: 'GET', url: '/categoryCheck', params: { path_array: path_array, category_array: category_array } }).success(
    function(check){
      if(check.result==false)
        $location.path("../");
      
      else
        $location.path("./");
    });
};


/*
* @author   : Do Hae Bin dhb0611
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to extrude list of all exisiting lists while enabling pagination setup simulatneously.
*   This function is called automatically once the page is loaded.
*/

$scope.initList = function(){

    typeCheck();

    $http({
        url: '/board/list/', 
        method: "GET",
        params: {
            categoryId: $routeParams.id            
        }
    }).success(function (data) {

      $scope.boardPostList = data;
 

        $scope.range = function() {
            var rangeSize = $scope.pageCount();
            var ret = [];
            var start = 0;

            if ( start > $scope.pageCount()-rangeSize ) {
                start = $scope.pageCount()-rangeSize+1;
            }

            for (var i=start; i<start+rangeSize; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function() {
            if ($scope.currentPage > 0) {$scope.currentPage--;}
        };
        $scope.prevPageDisabled = function() {
            return $scope.currentPage === 0;
        };
        $scope.pageCount = function() {
            return Math.ceil(parseFloat($scope.boardPostList.length)/parseFloat($scope.itemsPerPage));
        };
        $scope.nextPage = function() {
            if ($scope.currentPage < $scope.pageCount()-1) {$scope.currentPage++;}
        };
        $scope.nextPageDisabled = function() {
            return $scope.currentPage === $scope.pageCount();
        };
        $scope.setPage = function(n) {
            $scope.currentPage = n;
        };
    });

    $scope.categoryId = $routeParams.id;          
};

/*
* @author   : Oh taek kyung wjk751
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to load view of board which user want.
*   This function is called automatically once the page is loaded.
*/

$scope.initView=function(){

    typeCheck();

    $http.get("/board/post/"+$routeParams.CategoryId +"/"+$routeParams.id).success(function(data){
        $scope.boardPost = data;
      
        if($scope.boardPost.files[0]) {
            if(data.files[0].size>1024*1024) {
                $scope.boardPost.files[0].size=(data.files[0].size/1024/1024).toFixed(1) + "M";
            }     
            else if (data.files[0].size>1024){
                $scope.boardPost.files[0].size=(data.files[0].size/1024).toFixed(1) +"K";
            }
            else
                $scope.boardPost.files[0].size= data.files[0].size +"byte";
        }
        $scope.boardPost.contents = $sce.trustAsHtml($scope.boardPost.contents);
    });
};       

/*
* @author   : Oh taek kyung wjk751
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to modify board contents and while enabling pagination setup simulatneously.
*   This function is called automatically once the page is loaded.
*/

  $scope.initModify = function(){
    
    typeCheck();

    $http.get("/board/post/"+$routeParams.CategoryId+"/"+$routeParams.id).success(function(data){
      $scope.title = data.title;
      if(CKEDITOR.instances[text_editor])
        delete CKEDITOR.instances[text_editor];
      /*CKEDITOR.instances.text_editor.setData(data.contents);*/
      $scope.contents = data.contents;
      $scope.id=data.id;
      if(data.files[0])
        $scope.file_id=data.files[0].id;
      $scope.CategoryId=data.CategoryId;
      $scope.UserId=data.UserId;
    });
  };


/*
* @author   : Do Hae Bin dhb0611
* @param    : int id and checked value.
* @return   : no return
* @summary  :
*   A function to enable a specific checkbox.
*   This function is called when the checkbox is clicked.
*/


//check box click and unclick
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
    
    angular.forEach($scope.boardPostList, function(value) {
      value.selected = checked;
      $scope.userChecked.push(value.id);
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
*   A function to delete a specific board content.
*   This function is called when the delete button is called upon.
*/

//delete function
  $scope.delete=function(id) {
    var cf = confirm("삭제하시겠습니까?")
    if(cf) {
      $http.delete('/board/' + id); 
      $window.location.reload("/board/"+$routeParams.id+"/list");
    }
  };

/*
* @author   : Do Hae Bin dhb0611
* @param    : no parameter.
* @return   : no return
* @summary  :
*   A function to delete selected board content in the list.
*   This function is called when the deleteSelect button is called upon.
*/
    

  $scope.deleteSelect=function() {
    for(var arrIndex in $scope.userChecked){
      var boardId = $scope.userChecked[arrIndex];
      
      $http.delete('/board/' + boardId);
    };

    $scope.boardPostList = $scope.boardPostList.filter(function(item){
      return !item.selected;
    });

    $scope.userChecked = [];
    $window.location.reload("/board/"+$routeParams.id+"/list");
  };

/*
* @author   : Oh taek kyung wjk751
* @param    : contained file.
* @return   : no return
* @summary  :
*   A function to upload board contents.
*   This function is called when board contents are submitted to write.
*/

  //board upload
  $scope.uploadPost = function (file) {
    if(file != null){
      file.upload = Upload.upload({
        url: '/board',
        method: 'POST',
        fields: {
          title: $scope.title,
          CategoryId: $routeParams.id,
          //contents: CKEDITOR.instances.text_editor.getData()
          contents: $scope.contents
        },
        file: file
      });
      file.upload.success(function (data, status, headers, config) {
        // file is uploaded successfully
        $location.path("/board/"+$routeParams.id+"/list");
      });
      file.upload.then(function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      });
      file.upload.progress(function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }else{
      $http.post('/board',{
        title: $scope.title,
        CategoryId: $routeParams.id,
        //contents: CKEDITOR.instances.text_editor.getData()
        contents: $scope.contents
      });
      $location.path("/board/"+$routeParams.id+"/list");
    }    
  };

/*
* @author   : Oh taek kyung wjk751
* @param    : contained file.
* @return   : no return
* @summary  :
*   A function to modify board contents.
*   This function is called when board contents are submitted to modify.
*/

  //board update
  $scope.updatedPost = function (file) {

    if(file != null){
      file.upload = Upload.upload({
        url: '/board/' + $scope.CategoryId+'/' +$scope.id,
        method: 'PUT',
        fields: {
          title: $scope.title,
          CategoryId: $routeParams.CategoryId,
          //contents: CKEDITOR.instances.text_editor.getData(),
          contents: $scope.contents,
          id : $scope.file_id
        },
        file: file
        //fileFormDataName: 'photo'
      });
      file.upload.success(function (data, status, headers, config) {
        // file is uploaded successfully
        $location.path("/board/"+$routeParams.CategoryId+"/list");
      });
      file.upload.then(function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      });
      file.upload.progress(function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }else{
      $http.put('/board/' + $scope.CategoryId+ '/' +$scope.id,{
        title: $scope.title,
        CategoryId: $scope.CategoryId,
        //contents: CKEDITOR.instances.text_editor.getData()
        contents: $scope.contents
      });
      $location.path("/board/"+$routeParams.CategoryId+"/list");
    }
  };


/*
* @author   : Do Hae Bin dhb0611
* @param    : contained file path.
* @return   : no return
* @summary  :
*   A function to enable download of the attatched file.
*   This function is called when the attatched file is clicked upon.
*/
    

$scope.download = function(data) {
    // Get file name from url.

    var filename = data.substring(data.lastIndexOf("/") + 1).split("?")[0];
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var attachment = document.createElement('a');
      attachment.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
      attachment.download = $scope.boardPost.files[0].file_name; // Set the file name.
      attachment.click();
    };
    
    xhr.open('GET', data);
    xhr.send();
  };
  /*
  * @author   : Jeong Seung Hwan party1996115
  * @param    : no parameter
  * @return   : no return
  * @summary  :
  *   A function to get category list whose type is '1'. type 1 is Information type and get all type 1 categories.
  */
  $scope.initInfoList = function() {
    $http.get("/board/info/list").success(function(data){
      $scope.boardInfoList = data;
    });
  };

  /*
  * @author   : Jeong Seung Hwan party1996115
  * @param    : no parameter
  * @return   : no return
  * @summary  :
  *   A function to get category contents by using Category Id. contents will use for modify page.
  */
  $scope.initInfoModify = function(){
    typeCheck();

    $http.get("/info/"+$routeParams.CategoryId).success(function (data){
      $scope.id=data.id;
      $scope.CategoryId=data.CategoryId;
      $scope.contents=data.contents;
    });
  }

  /*
  * @author   : Kim Dong Min harace
  * @param    : no parameter
  * @return   : no return
  * @summary  :
  *   A function to get category contents by using Category Id. contents will use for view page.
  */
  $scope.initInfoView = function(){
    typeCheck();

    $http.get("/info/"+$routeParams.CategoryId).success(function (data){
      $scope.id=data.id;
      $scope.CategoryId=data.CategoryId;
      $scope.contents=$sce.trustAsHtml(data.contents);
    });
  }
  
  /*
  * @author   : Jeong Seung Hwan party1996115
  * @param    : no parameter
  * @return   : no return
  * @summary  :
  *   A function to update category contents. If we push submit button at modify page, it will call this function and
  * update new data at database.
  */
  $scope.updatedInfo = function () {
    $http.put('/info/'+ $routeParams.CategoryId,{
      contents: $scope.contents
    });
    $location.path("/info/" + $scope.CategoryId + "/view");
    //$window.location.reload("/info/" + $scope.CategoryId + "/view");
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
    $scope.boardPostList = orderBy($scope.boardPostList, $scope.orderProperty, $scope.reverse);
  };

}]);