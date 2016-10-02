/*
* @author	: 강성필 hwhale
* @param 	: controller
* @return	: no return
* @summary	:
*	A controller which is used in URL '/admin#/popup'. (popup_list.html)
*	Shows the list of popups.
*/
app.controller('popupCtrl', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
	$scope.popupList = [];
	/*
	* @author	: 강성필 hwhale
	* @param 	: no parameter
	* @return	: no return
	* @summary	:
	*	A function to get the list of all existing popups,
	*	that is automatically called when the page loaded.
	*/
	$scope.loadPopupList = function() {
		$http.get("/popup/list").success(function(res) {
			$scope.popupList = res;
			$scope.popupList.forEach(function( val ) {
				val.startDate = new Date(val.startDate).toISOString().slice(0, 10);
				val.endDate = new Date(val.endDate).toISOString().slice(0,10);
			});
		});
	};

	/*
	* @author	: 강성필 hwhale
	* @param 	: int id / numeric id to specify the popup which admin want to delete
	* @return	: no return
	* @summary	:
	*	A function to delete a specific popup that admin want to delete,
	*	that is binded with a delete button in page.
	*/
	$scope.deletePopup = function(id) {
		if( !confirm("정말로 삭제하시겠습니까?") )
			return;

		$http.delete("/popup/"+id).success(function(res){
			if( res.error ) {
				alert("오류가 발생했습니다. 다시 시도해주세요.");
				return;
			}
			alert("해당 팝업을 삭제하였습니다.");
			location.reload(true);
		});
	};
}]);

/*
* @author	: 강성필 hwhale
* @param 	: Controller
* @return	: no return
* @summary	:
* 	A controller which is used in URL '/admin#/add'. (popup_add.html)
*	Includes functions which are needed to add a new popup.
*/
app.controller('popupAddCtrl', ['$scope', '$http', '$location', 'Upload', function($scope, $http, $location, Upload) {
	$scope.popupStart = { opened: false, date: null };
	$scope.popupEnd = { opened: false, date: null };
	$scope.file = [];
	$scope.submitData = {};
	
	/*
	* @author	: 강성필 hwhale
	* @param 	: no parameter
	* @return	: no return
	* @summary	:
	* 	When admin press the save button in '/admin#/add', this function is called.
	*	Send the request to save new popup, and represent the result.
	*/
	$scope.savePopup = function() {
		Upload.upload({
        	url: '/popup/add',
			method: 'POST',
			data: $scope.submitData,
			file: $scope.submitData.file,
			fileFormDataName: 'image'
		}).then(function success(res) {
			console.log(res.data);
			if( res.data.error ){
				alert('오류가 발생하였습니다. 다시 시도해주세요.');
            } else {
            	var resData = res.data;
				alert("팝업이 등록되었습니다.");
				$location.url("/popup");
            }
		}, function error(res) {
			alert('an error occured');
		}, function progress(event) {

		});
	};
	/*
	* @author	: 강성필 hwhale
	* @param 	: no parameter
	* @return	: no return
	* @summary	:
	* 	Functions and datas which are needed to show datepicker
	*	which is needed to select the date by gui calendar.
	*/
	$scope.openStart = function() {
		$scope.popupStart.opened = true;
	};
	$scope.openEnd = function() {
		$scope.popupEnd.opened = true;
	};
}]);

/*
* @author	: 강성필 hwhale
* @param 	: Controller
* @return	: no return
* @summary	:
* 	The controller which is used in URL '/admin#/modify/:id'. (popup_modify.html)
*	Includes functions which are needed to modify the popup which is already exist.
*/
app.controller('popupModifyCtrl', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
	/*
	* @author	: 강성필 hwhale
	* @param 	: no parameter
	* @return	: no return
	* @summary	:
	* 	Get data of the popup you want to modify and show to admin.
	*/
	$scope.initPopup = function() {
		$http.get("/popup/modify/"+$routeParams.popupId).success(function(res) {
			if( res.error ) {
				alert("존재하지 않는 팝업입니다.");
				return;
			}
			$scope.submitData = {
				title: res.title,
				startDate: new Date(res.startDate),
				endDate: new Date(res.endDate),
				width: res.width,
				height: res.height,
				path: res.path
			};
		});
	};

	/*
	* @author	: 강성필 hwhale
	* @param 	: no parameter
	* @return	: no return
	* @summary	:
	* 	Modify the existing popup to new values.
	*/
	$scope.modifyPopup = function() {
		$http.put("/popup", {
			id: $routeParams.popupId,
			data: $scope.submitData
		}).success(function (res){
			alert("변경되었습니다.");
			$location.url("/popup");
		});
	};

	/*
	* @author	: 강성필 hwhale
	* @param 	: no parameter
	* @return	: no return
	* @summary	:
	* 	Functions and datas which are needed to show datepicker
	*	which is needed to select the date by gui calendar.
	*/
	$scope.popupStart = { opened: false, date: null };
	$scope.popupEnd = { opened: false, date: null };
	$scope.openStart = function() {
		$scope.popupStart.opened = true;
	};
	$scope.openEnd = function() {
		$scope.popupEnd.opened = true;
	};
}]);