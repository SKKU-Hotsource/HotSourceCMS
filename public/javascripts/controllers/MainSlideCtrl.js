/*
* @author Jungheeyoon gmldbs3445
* @summary MainSlideCtrl controlls slides in admin permission
*/
app.controller('mainSlideCtrl',['$scope', '$http', 'Upload', '$location', function($scope, $http, Upload, $location){
    /*
    * @author Jungheeyoon gmldbs3445
    * @summary Show slides list to mangage
    */
    $scope.initlist = function(){
        var numberofslide;
        var seqs = []; //for save seqs numbers ex) numberofslide is 5, then seqs = [0,1,2,3,4].
        $http.get("/slide").success(
        function (data) {
            $scope.SlidePostList = data;
            for(var i in $scope.SlidePostList) {
                $scope.SlidePostList[i].seq = $scope.SlidePostList[i].seq.toString();
                $scope.SlidePostList[i].show = $scope.SlidePostList[i].show.toString();
            }
            numberofslide = Object.keys(data).length;
            for(var i = 0; i < numberofslide; i++){
                seqs[i] = {seq :i.toString()};
            }
        });
        $scope.seqs = seqs; //$scope.seqs is for <select>'s <option>
    }

    /*
    * @author Jungheeyoon gmldbs3445
    * @summary Save sequence of slides(if select sequence, orginally sequence slide and selected sequence slide are reversed)
    */
    $scope.seqsave = function(id, sequence){
        var dataSave, url, config, idchanged, seqchanged;
        $http.get("/slide").success(function (data) {
            var numberofslide = Object.keys(data).length;
            for(var i = 0; i < numberofslide; i++){
                if(data[i].id == id){
                    seqchanged = data[i].seq;
                }
                if(data[i].id != id && data[i].seq == sequence){
                    idchanged = data[i].id;
                }
            }
            url = "/slide/" + id;
            dataSave = {
                seq : sequence
            };
            $http.put(url, dataSave, config).success(function (dataSave, status, headers) {
                url = "/slide/" + idchanged;
                dataSave = {
                    seq : seqchanged
                };
                $http.put(url, dataSave, config).success(function(dataSave, status,headers){
                    location.reload();
                });
            });
        });
    }

    /*
    * @author Jungheeyoon gmldbs3445
    * @summary Save wheter show slide or conseal slide 
    */
    $scope.showsave = function(id, show, seq){
        var dataSave, url, dataUpdate, urlUpdate, config;
        url = "/slide/" + id;
        dataSave = {
            show : show
        };
        $http.put(url, dataSave, config).success(function(dataSave, status,headers){
            location.reload();
        });   
    }

    /*
    * @author Jungheeyoon gmldbs3445
    * @summary Delete slide 
    */
    $scope.sdelete = function(id, seq){
        var cf = confirm("Delete this slide?");
        var dataDelete;
        var deleteUrl, updateUrl;
        if(cf){
            $http.get("/slide").success(function (data) {
                var numberofslide = Object.keys(data).length;
                deleteUrl = "/slide/" + id;
                for(var i = 0; i<numberofslide; i++){
                    if(data[i].seq > seq){
                        updateUrl = "/slide/" + data[i].id;
                        dataDelete = {
                            seq : data[i].seq -1
                        };
                        $http.put(updateUrl, dataDelete, null).success(function(dataDelete, status, headers){
                            //success
                        })
                    }
                }
                $http.delete(deleteUrl, dataDelete).success(function(dataDelete, status, headers){
                    location.reload();
                })
            });
        }
     }

    /*
    * @author Jungheeyoon gmldbs3445
    * @summary Get slides list to add slide
    */
     $scope.initadd = function(){
        $http.get("/slide").success(
            function (data) {
            $scope.number = Object.keys(data).length;
        });
    }

    /*
    * @author Jungheeyoon gmldbs3445
    * @summary Upload picture of slide when click button
    */
    $scope.uploadPic = function (file) {
        file.upload = Upload.upload({
            url: '/slide',
            method: 'POST',
            fields: {
                title: $scope.title,
                link: $scope.link,
                seq: $scope.number
            },
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
            // file is uploaded successfully
            $location.path("/slide/list");
        });
        
    }

     
}]);