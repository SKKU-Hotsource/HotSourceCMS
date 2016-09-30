app.controller('paperCtrl', ['$scope', '$http', '$location', '$window', '$routeParams', function($scope, $http, $location, $window,$routeParams){
/*	$scope.submitData = {};*/

	$scope.initPaper = function() {
		$http.get("/paper/list/"+$routeParams.CategoryId)
			.success(function(data){
				$scope.paperList = [];
				var paperElmt = {};
				var setYear = "";
				for(idx in data) {
					var paper = data[idx];
					paper.publish_date = new Date(paper.publish_date).toISOString().slice(0, 10);
					var year = paper.publish_date.split('-')[0];
					if(setYear != year) {
						if(setYear != "")
							$scope.paperList.push(paperElmt);
						setYear = year;
						paperElmt = initElmt(setYear);
					}
					paperStr = mkPaperStr(paper);
					if(paper.count_of_origin == "international") {
						if(paper.publication_type == "journal")
							paperElmt.international.journal.push(paperStr);
						else if(paper.publication_type == "conference")
							paperElmt.international.conference.push(paperStr);
					}
					else if(paper.count_of_origin == "domestic") {
						if(paper.publication_type == "journal")
							paperElmt.domestic.journal.push(paperStr);
						else if(paper.publication_type == "conference")
							paperElmt.domestic.conference.push(paperStr);
					}

				}
				$scope.paperList.push(paperElmt);
		});
	}

	$scope.open = function(){
		$scope.opened = true;
	}
	$scope.initSubmit = function(){
		$scope.submitData = {};
	}

	$scope.addPaper = function(){
		$scope.submitData.CategoryId=$routeParams.CategoryId;
		$http.post("/paper",$scope.submitData)
			.success(function(data){
				console.log($scope.submitData);
				var year = new Date($scope.submitData.publish_date).toISOString().slice(0, 10).split('-')[0];
				$scope.submitData.publish_date=new Date($scope.submitData.publish_date).toISOString().slice(0, 10);
				for(idx in $scope.paperList) {
					if($scope.paperList[idx].year == year) {
						console.log($scope.submitData.count_of_origin);
						if($scope.submitData.count_of_origin == "1") {
							if($scope.submitData.publication_type == "1")
								$scope.paperList[idx].international.journal.push(mkPaperStr($scope.submitData));
							else if($scope.submitData.publication_type == "0")
								$scope.paperList[idx].international.conference.push(mkPaperStr($scope.submitData));
						}
						else if($scope.submitData.count_of_origin == "0") {
							if($scope.submitData.publication_type == "1")
								$scope.paperList[idx].domestic.journal.push(mkPaperStr($scope.submitData));
							else if($scope.submitData.publication_type == "0")
								$scope.paperList[idx].domestic.conference.push(mkPaperStr($scope.submitData));
						}
						return;
					}
				}
				var paperElmt = initElmt(year);
				if($scope.submitData.count_of_origin == "1") {
					if($scope.submitData.publication_type == "1")
						paperElmt.international.journal.push(mkPaperStr($scope.submitData));
					else if($scope.submitData.publication_type == "0")
						paperElmt.international.conference.push(mkPaperStr($scope.submitData));
				}
				else if($scope.submitData.count_of_origin == "0") {
					if($scope.submitData.publication_type == "1")
						paperElmt.domestic.journal.push(mkPaperStr($scope.submitData));
					else if($scope.submitData.publication_type == "0")
						paperElmt.domestic.conference.push(mkPaperStr($scope.submitData));
				}
				$scope.paperList.push(paperElmt);
		});
	}

	$scope.initModify = function(){
		$scope.modifyData={};

		$http.get("/paper/"+$routeParams.id)
			.success(function(data){
				$scope.modifyData=data;
				if(data.count_of_origin)
					$scope.modifyData.count_of_origin = data.count_of_origin.toString();
				$scope.modifyData.publication_type = data.publication_type ? "1" : "0";
				if(data.citation_index)
					$scope.modifyData.citation_index=data.citation_index.toString();
				$scope.modifyData.publish_date = new Date(data.publish_date).toISOString().slice(0, 10);
			});
	}

	$scope.modifyPaper = function(){
		console.log($scope.modifyData);
		$http.put("/paper/"+$routeParams.id,$scope.modifyData)
			.success(function(data){
				$location.path("/paper/"+$routeParams.CategoryId+"/list");
		})
	}

	$scope.deletePaper = function(id){
		var cf = confirm("삭제하시겠습니까?")
	    if(cf) {
			$http.delete("/paper/"+id)
				.success(function(data){
					$window.location.reload("/paper/"+$routeParams.CategoryId+"/list");
			})
		}
	}
}]);

var initElmt = function(year) {
	var paperElmt = {};
	paperElmt.year = year;
	paperElmt.international={};
	paperElmt.domestic={};
	paperElmt.international.journal=[];
	paperElmt.international.conference=[];
	paperElmt.domestic.journal=[];
	paperElmt.domestic.conference=[];

	return paperElmt;
};

var mkPaperStr = function(paper) {
	var paperStr = {};
	paperStr.id = paper.id;
	paperStr.lead_author = paper.lead_author;
	paperStr.co_author = paper.co_author;
	paperStr.corresponding_author = paper.corresponding_author;
	paperStr.count_of_origin = paper.count_of_origin;
	paperStr.publication_type = paper.publication_type;
	paperStr.citation_index = paper.citation_index? paper.citation_index : "";
	paperStr.vol = paper.vol? paper.vol : "";
	paperStr.no = paper.no? paper.no : "";
	paperStr.pp = paper.pp? paper.pp : "";
	paperStr.publish_date = paper.publish_date;
	paperStr.format = paper.format? paper.format : "";
	paperStr.url = paper.url? paper.url : "";
	paperStr.CategoryId = paper.CategoryId;

	paperStr.author = ""+paper.lead_author;
	if(paper.co_author)
		paperStr.author+=", "+paper.co_author;
	if(paper.corresponding_author)
		paperStr.author+=", "+paper.corresponding_author;
	paperStr.title =paper.title;
	paperStr.publication_name=paper.publication_name;
	if(paper.publication_type=="journal") {
		paperStr.index = "Vol."+paper.vol+", No."+paper.no+", pp."+paper.pp;
	}
	else if(paper.publication_type=="conference") {
		paperStr.index = "pp."+paper.pp;
	}
	paperStr.publish_date = paper.publish_date;
	return paperStr;
};