/*
* @author Kimdongmin harace
* @summary MainAdminCtrl controll variable and function for main administration page
*/
app.controller('mainAdminCtrl',['$scope', '$http', 'Upload', '$location', '$rootScope', function($scope, $http, Upload, $location, $rootScope){
	$http.get("/mainAdmin")
		.success(function(data){
			$scope.logoFile= data.mainLogo;
			$scope.title= data.title;
			$scope.useSlide= (1 == data.useSlide);
			$scope.leftBoard= data.leftBoard ? data.leftBoard.toString() : null;
			$scope.rightBoard= data.rightBoard ? data.rightBoard.toString() : null;
		});

	$http.get("/category")
		.success(function(data){
			boardList = [];
			for(element in data) {
				if(data[element].type == "board") {
					boardList.push(data[element]);
				}
			}
			$scope.boardList = boardList;
		});

	/*
	* @author Kimdongmin harace
	* @param object file File contain logo file for updating
	* @summary update mainAdmin table and if file is existing, upload that
	*/
	$scope.updateMain = function (file) {
		var data = {
				useSlide: $scope.useSlide ? 1 : 0,
				leftBoard: $scope.leftBoard,
				rightBoard: $scope.rightBoard,
				title: $scope.title
		};
		if(!$scope.leftBoard) {
			delete data.leftBoard;
			delete data.rightBoard;
		}
		else if(!$scope.rightBoard) {
			delete data.rightBoard;
		}
		if(file != null) {
			file.upload = Upload.upload({
				url: '/mainAdmin',
				method: 'PUT',
				fields: data,
				file: file,
				fileFormDataName: 'photo'
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
				$scope.logoFile = data.mainLogo;
				$rootScope.mainAdmin.mainLogo = data.mainLogo;
				$rootScope.mainAdmin.title = data.title;
				$rootScope.cusAlert("변경이 완료되었습니다.","success",2000);
			});
		} else {
			$http.put('/mainAdmin', data).success(function(){
				$rootScope.mainAdmin.title = data.title;
				$rootScope.cusAlert("변경이 완료되었습니다.","success",2000);
			});
		}
	};
}]);