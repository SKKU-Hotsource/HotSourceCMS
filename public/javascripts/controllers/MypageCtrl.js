/*
* @author : 박한나 yu4763
* @summary :
*A controller which is used in URL '/mypage' and '/mypage/modify'.
* MypageCtrl controlls variable and function for mypage which shows the information of the user in login and the page which could modify that information.
*/

app.controller('mypageCtrl', ['$rootScope', '$scope', '$cookies', '$http', '$location', function($rootScope, $scope, $cookies, $http, $location){

    /*
    * @author : 박한나 yu4763
    * @param  : no parameter
    * @return : no return
    * @summary  :
    * To modify email address, user should enter his or her PW and new email address.
    This function checks the pW which user enter is correct, and if it does, modify the email address of user.
    */
    $scope.emailSubmit = function(){
        var submit = {
            password:$scope.password,
            email: $scope.new_email
        };
        $http.put('/user/'+$rootScope.session.user_id,submit).success(
            function( res ){
                if( !res.error ) {
                    var session = $rootScope.session;
                    $rootScope.session.email = $scope.new_email;
                    $scope.email = $scope.new_email;
                    alert("변경되었습니다.");
                }
                else
                    alert("변경에 실패했습니다. 다시 시도해주세요.");
        });
    };

    /*
    * @author : 박한나 yu4763
    * @param  : no parameter
    * @return : no return
    * @summary  :
    * To modify password, user should enter his or her PW and new password two times.
    This function checks two of new password is equal.
    If it does, it checks the pW which user enter is correct.
    If it does, password is modified.
    */
    $scope.passwordSubmit = function(){
        if($scope.new_password != $scope.re_new_password){
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        var submit = {
            password: $scope.new_password,
            oldPassword: $scope.password
        };
        $http.put('/user/password/'+$rootScope.session.user_id,submit).success(
            function(data){
                if( !res.error )
                    alert("변경되었습니다.");
                else
                    alert("변경에 실패했습니다. 다시 시도해주세요.");
                window.location.reload(true);
        });
    };

    /*
    * @author : 박한나 yu4763
    * @param  : no parameter
    * @return : no return
    * @summary  :
    *   Show the information of user. ( user's ID and user's email address)
    ID of user is also stored in 'id' to prepare the occasion which users want to delete their account.
    */
    $scope.info = function(){
        $scope.user_name = $rootScope.session.user_name;
        $scope.email = $rootScope.session.email;
        // 회원 탈퇴를 위해 user_id 값 필요
        $scope.id=$rootScope.session.user_id;
    };

    /*
    * @author : 박한나 yu4763
    * @param  : ID of user ('id')
    * @return : no return
    * @summary  :
    When users want to delete their account,
    This function checks it one more time, and if users really want it,
    Delete the account of the user in DB.
    */
    $scope.deleteUser=function(id){
        // $scope.cusAlert("회원탈퇴가 완료되었습니다.","success",2000);
        var cf=confirm(id+"님 탈퇴하시겠습니까?");
        if(cf){
            $http.delete('/user/').success(function(){
                alert("회원탈퇴가 완료되었습니다.");
                $rootScope.session = null;
                $location.path( "/" );    
            });
        }
    };
}]);
