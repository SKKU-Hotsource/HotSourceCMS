app.controller('videoCtrl',['$scope', '$http', 'Upload' ,'$routeParams' ,'$sce', '$location', '$rootScope','$window', '$filter','orderByFilter',  function($scope, $http, Upload, $routeParams, $sce, $location,$rootScope,$window,$filter,orderBy) {

$scope.itemsPerPage = 9;
$scope.currentPage = 0;

/*
* @author   : Do Hae Bin dhb0611 &  Oh taek kyung wjk751
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
* @author   : Oh taek kyung wjk751
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to extrude list of all exisiting lists while enabling pagination setup simulatneously.
*   This function is called automatically once the page is loaded.
*/

$scope.initList = function(){
	
	typeCheck();

	$http({
	    url: '/video/list/', 
	    method: "GET",
	    params: {
	    	categoryId: $routeParams.id,
	    }
	}).success(function (data) {
		$scope.videoPostList = data.videoList;

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
			return Math.ceil(parseFloat($scope.videoPostList.length)/parseFloat($scope.itemsPerPage));
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
* @author   : Do Hae Bin dhb0611
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to extrude list of all exisiting lists in a thumbnail formation
* 	while enabling pagination setup simulatneously.
*   This function is called automatically once the user_video page is loaded.
*/


$scope.initThumb = function(){
	
	typeCheck();
	$http({
		url: '/video/list/', 
		method: "GET",
		params: {
			categoryId: $routeParams.id	
		}
	}).success(function (data) {
		$scope.videoPostList = data.videoList;
		$scope.videoList = [];    
		
		data.videoList.forEach(function (value) {
		    var thumbnail = {
		    	id : value.id,
		    	title : value.title,
		    	src : value.path
		    };
		    $scope.videoList.push(thumbnail);
		});

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
			return $scope.currentPage === 0 ? "disabled" : "";
		};
		$scope.pageCount = function() {
		    return Math.ceil(parseFloat($scope.videoList.length)/parseFloat($scope.itemsPerPage));
		};
		$scope.nextPage = function() {
			if ($scope.currentPage < $scope.pageCount()-1) {$scope.currentPage++;}
		};
		$scope.nextPageDisabled = function() {
		    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
		};
		$scope.setPage = function(n) {$scope.currentPage = n;};
	});

	$scope.categoryId = $routeParams.id;
};

/*
* @author   : Oh taek kyung wjk751
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to load view of video which user want.
*   This function is called automatically once the page is loaded.
*/

$scope.initView = function(){
	
	typeCheck();

	$http.get("/video/post/"+$routeParams.CategoryId +"/"+$routeParams.id).success(function (data) {
		$scope.videoPost = data;
		$scope.videoPost.contents = $sce.trustAsHtml($scope.videoPost.contents);
		if(data.files[0].size>1024*1024) {
			$scope.videoPost.files[0].size=(data.files[0].size/1024/1024).toFixed(1) + "M";
		}
		else if (data.files[0].size>1024){
			$scope.videoPost.files[0].size=(data.files[0].size/1024).toFixed(1) +"K";
		}	
		else{
			$scope.videoPost.files[0].size= data.files[0].size +"byte";
		}

		$scope.config = {
			preload: "auto",
			autoHide: false,
			autoHideTime: 3000,
			autoPlay: false,
			sources: [
			   	{src: $sce.trustAsResourceUrl($scope.videoPost.files[0].path), type: "video/mp4"}
			],
			theme: {
				url: "/bower_components/videogular-themes-default/videogular.css"
			}
		};
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

		angular.forEach($scope.videoPostList, function(value) {
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
*   A function to delete a specific user.
*   This function is called when the delete button is called upon.
*/


//delete function 
	$scope.delete=function(id) {
        var cf = confirm("삭제하시겠습니까?")
        if(cf) {
            $http.delete('/video/' + id); 
            $window.location.reload("/board/"+$routeParams.id+"/list");        }
        
    };



/*
* @author   : Do Hae Bin dhb0611
* @param    : no parameter.
* @return   : no return
* @summary  :
*   A function to delete selected video content in the list.
*   This function is called when the deleteSelect button is called upon.
*/

	$scope.deleteSelect=function() {
		for(var arrIndex in $scope.userChecked){
			var videoId = $scope.userChecked[arrIndex];
			$http.delete('/video/' + videoId);
		};

  		$scope.videoPostList = $scope.videoPostList.filter(function(item){
			return !item.selected;
 		});
  		$window.location.reload("/board/"+$routeParams.id+"/list");
		$scope.userChecked = [];
  		
	};

/*
* @author   : Oh taek kyung wjk751
* @param    : no parameter
* @return   : no return
* @summary  :
*   A function to modify video contents while enabling pagination setup simulatneously.
*   This function is called automatically once the page is loaded.
*/

	$scope.initModify = function(){
		
		typeCheck();

		$http.get("/video/post/"+$routeParams.CategoryId+ "/"+$routeParams.id).success(
		function(data){
		    $scope.title = data.title;  
		    $scope.contents = data.contents;
		    //CKEDITOR.instances.text_editor.setData(data.contents);
		    $scope.id=data.id;
		    $scope.file_id=data.files[0].id;
		    $scope.CategoryId=data.CategoryId;
		    $scope.UserId=data.UserId;
		});

	};

/*
* @author   : Oh taek kyung wjk751
* @param    : contained file.
* @return   : no return
* @summary  :
*   A function to upload video contents.
*   This function is called when video contents are submitted to write.
*/

	//video upload
	$scope.uploadPost = function (file) {
		file.upload = Upload.upload({
			url: '/video',
			method: 'POST',
			fields: {
				title: $scope.title,
				CategoryId: $routeParams.id,
				contents: $scope.contents
				},
			file: file,
			fileFormDataName: 'video'
		});

		file.upload.then(function (response) {
		}, function (response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		});

		file.upload.progress(function (evt) {
			// Math.min is to fix IE which reports 200% sometimes
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});
		file.upload.success(function (data, status, headers, config) {
			// file is uploaded successfully
			$location.path("/video/"+$routeParams.id+"/list");
		});
	};

/*
* @author   : Oh taek kyung wjk751
* @param    : contained file.
* @return   : no return
* @summary  :
*   A function to modify video contents.
*   This function is called video contents are submitted to modify.
*/

	//video update
	$scope.updatedPic = function (file) {
		if(file != null){
			file.upload = Upload.upload({
	        	url: '/video/' +$scope.CategoryId+'/'+ $scope.id,
	            method: 'PUT',
	            fields: {
	            	title: $scope.title,
	                CategoryId: $scope.CategoryId,
	                UserId: $scope.UserId,
	                contents: $scope.contents,
	                id : $scope.file_id
	                },
	                file: file,
	                fileFormDataName: 'video'
	            });
			file.upload.then(function (response) {
	        }, function (response) {
	        	if (response.status > 0)
	             	$scope.errorMsg = response.status + ': ' + response.data;
	        });
			file.upload.progress(function (evt) {
	        	// Math.min is to fix IE which reports 200% sometimes
	            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	        });
			file.upload.success(function (data, status, headers, config) {
	        	// file is uploaded successfully
	        });
			$location.path("/video/"+$scope.CategoryId+"/list");
		}else{
			$http.put('/video/'+$scope.CaategoryId+'/'+$scope.id,{
	            	title: $scope.title,
	                CategoryId: $scope.CategoryId,
	                UserId: $scope.UserId,
	                contents: CKEDITOR.instances.text_editor.getData(),
	                author: $scope.author
	        });
		}

		$location.path("/video/"+$scope.CategoryId+"/list");
	    
	};

/*
* @author   : Do Hae Bin dhb0611
* @param    : contained file path.
* @return   : no return
* @summary  :
*   A function to enable download of the attatched file.
*   This function is called when the attatched file is clicked upon.
*/

/*
* @author   : Do Hae Bin dhb0611
* @param    : contained file path.
* @return   : no return
* @summary  :
*   A function to enable download of the attatched file.
*   This function is called when the attatched file is clicked upon.
*/

$scope.download = function(data) {
  var filename = data.substring(data.lastIndexOf("/") + 1).split("?")[0];
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var attachment = document.createElement('a');
    attachment.href = window.URL.createObjectURL(xhr.response); 
    attachment.download = $scope.videoPost.files[0].file_name; 
    attachment.click();
       
  };
  
  xhr.open('GET', data);
  xhr.send();
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
    $scope.videoPostList = orderBy($scope.videoPostList, $scope.orderProperty, $scope.reverse);
  };

	
}]);

