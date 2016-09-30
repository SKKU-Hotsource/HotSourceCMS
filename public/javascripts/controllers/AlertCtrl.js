/*
  * @author   : Jeong Seung Hwan party1996115
  * @param    : alret message, alert type, time during alert is shown.
  * @return   : no return
  * @summary  : 
  *   A function to use customized alert. Use this function with ng-click. If this function call, alert is
  *   shown at bottom of window. 'diaLog' is alert message and 'use' is alert type(such as warning, error, 
  *   success ,etc.). time function indicates the duration of alert.
  */
app.controller('AlertCtrl', ['$scope',  function($scope){
     $scope.cusAlert = function(dialog, use, time){
        var dialogbox = document.getElementById("dialogbox");
        dialogbox.className = "alert alert-"+use;
        use = use.charAt(0).toUpperCase() + use.slice(1);
        dialogbox.style.right = "5%";
        dialogbox.style.bottom = "0px";
        document.getElementById('dialogbox').innerHTML = "<strong>" + use + "!&nbsp</strong>" + dialog;
        $("#dialogbox").slideDown("slow");
        setTimeout(function(){
            $("#dialogbox").slideUp("slow");
        }, time);
    }
}]);