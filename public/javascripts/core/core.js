var id = 0;

var app = angular.module('mainApp', [
    'ngRoute', 
    'ngFileUpload',   
    'ngCookies', 
    'ngSanitize',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster',
    'com.2fdevs.videogular.plugins.buffering',
    "angular-thumbnails"
]);

app.filter('offset', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
})

app.run(['$rootScope', '$http', '$cookies', '$location', '$controller', '$sce', function($rootScope, $http, $cookies, $location, $controller, $sce) {
    
    $http.get('/getSession').success(function(data) {
        $rootScope.session = data;
    })

    $http.get("/mainAdmin").success(
        function (data) {
            $rootScope.mainAdmin=data;
            $rootScope.mainAdmin.mainLogo = $rootScope.mainAdmin.mainLogo.split("\\").join("/");
    });

  //로그인 상태인지 체크
    $rootScope.loginInterceptor = function() {
        if(!$rootScope.session)
            $location.path( "/main#/login" );
    };
  //로그아웃 상태인지 체크
    $rootScope.logoutInterceptor = function() {
        if($rootScope.session)
            $location.path( "/main#/" );
    };
}]);

app.config(function ($routeProvider) {
  
    $routeProvider
    //template
    .when('/', {
        controller: 'mainCtrl',
        templateUrl: '/views/main.html'
    })
    .when('/info/:CategoryId/list', {
        redirectTo: '/info/:CategoryId/view'
    })
    .when('/info/:CategoryId/view', {
        controller: 'BoardCtrl',
        templateUrl: '/views/user/info/info_view.html'
    })
    .when('/board/:id/list', { 
        controller: 'BoardCtrl',
        templateUrl: '/views/user/board/board_list.html'
    })
    .when('/board/:CategoryId/view/:id', { 
        controller: 'BoardCtrl',
        templateUrl: '/views/user/board/board_view.html'   
    })
    .when('/video/:id/list', {
        controller: 'videoCtrl',
        templateUrl: '/views/user/video/video_thumbnails.html'
    }) 
    .when('/video/:CategoryId/view/:id', {
        controller: 'videoCtrl',
        templateUrl: '/views/user/video/video_view.html'
    })
    .when('/paper/:CategoryId/list', {
        controller: 'paperCtrl',
        templateUrl: '/views/user/paper/paper_list.html'
    }) 
    .when('/mypage', {
        controller: 'mypageCtrl',
        templateUrl: '/views/mypage.html'
    })
    .when('/mypage/modify', {
        controller: 'mypageCtrl',
        templateUrl: '/views/mypage_modify.html'
    })
    .when('/login', {
        controller: 'loginCtrl',
        templateUrl: '/views/login.html'
    })
    .when('/registry', {
        controller: 'loginCtrl',
        templateUrl: '/views/registry.html'
    })
    .when('/finding',{
        controller: 'loginCtrl',
        templateUrl: '/views/finding_user.html'
    })
    .when('/finding/id',{
        controller: 'loginCtrl',
        templateUrl: '/views/finding_id.html'
    })
    .when('/finding/pw',{
        controller: 'loginCtrl',
        templateUrl: '/views/finding_pw.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

//unsafe javascript:void(0) 앞 unsafe 딱지 때줌
app.config(function($compileProvider){
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});
