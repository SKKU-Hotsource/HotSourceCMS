var app = angular.module('adminApp', [
	'ngRoute',
	'ngFileUpload',
    'ngCookies',
	'ngSanitize',
	'ui.tree',
	'ui.bootstrap',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster',
    'com.2fdevs.videogular.plugins.buffering'
]);

app.filter('offset', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
})

app.run(function($rootScope, $http) {
  //로그인 세션
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

    $rootScope.cusAlert = function(dialog, use, time){
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
    };
});

app.config(function ($routeProvider) {
  $routeProvider
  	.when('/', {
    	controller: 'mainAdminCtrl',
    	templateUrl: '/views/admin/mainAdmin.html'
  	})
    .when('/mainAdmin', {
        controller: 'mainAdminCtrl',
        templateUrl: '/views/admin/mainAdmin.html'
    })
	.when('/board/:id/list', {
		controller: 'BoardCtrl',
		templateUrl: '/views/admin/board/board_list.html'
	})
	.when('/board/:id/write', {
		controller: 'BoardCtrl',
		templateUrl: '/views/admin/board/board_write.html'
	})
    .when('/board/:CategoryId/modify/:id', {
        controller: 'BoardCtrl',
        templateUrl: '/views/admin/board/board_modify.html'
    })
  	.when('/board/:CategoryId/view/:id', {
  		controller: 'BoardCtrl',
  		templateUrl: '/views/admin/board/board_view.html' 	
  	})
    .when('/info/:CategoryId/list', {
        redirectTo: '/info/:CategoryId/view'
    })
    .when('/info/:CategoryId/modify', {
        controller: 'BoardCtrl',
        templateUrl: '/views/admin/info/info_modify.html'   
    })
    .when('/info/:CategoryId/view', {
        controller: 'BoardCtrl',
        templateUrl: '/views/admin/info/info_view.html'   
    })
    .when('/paper/:CategoryId/list', {
        controller: 'paperCtrl',
        templateUrl: '/views/admin/paper/paper_list.html'   
    })
    .when('/paper/:CategoryId/modify/:id', {
        controller: 'paperCtrl',
        templateUrl: '/views/admin/paper/paper_modify.html'   
    })
  	.when('/slide/add', {
  		controller: 'mainSlideCtrl',
  		templateUrl: '/views/admin/slide/slide_add.html'
    })
  	.when('/slide/list', {
  		controller: 'mainSlideCtrl',
  		templateUrl: '/views/admin/slide/slide_list.html'
  	})
  	.when('/video/:id/list', {
        controller: 'videoCtrl',
        templateUrl: '/views/admin/video/video_list.html'
    }) 
    .when('/video/:CategoryId/view/:id', { 
        controller: 'videoCtrl',
        templateUrl: '/views/admin/video/video_view.html'
    })
    .when('/video/:CategoryId/modify/:id',{ 
        controller: 'videoCtrl',
        templateUrl: '/views/admin/video/video_modify.html'
    })
    .when('/video/:id/write',{ 
        controller: 'videoCtrl',
        templateUrl: '/views/admin/video/video_write.html'
    })
    .when('/category',{
        controller: 'categoryCtrl',
        templateUrl: '/views/admin/edit_category.html'
    })
    .when('/login', {
        controller: 'loginCtrl',
        templateUrl: '/views/login.html'
    })
    .when('/popup', {
        controller: 'popupCtrl',
        templateUrl: '/views/admin/popup_list.html'
    })
    .when('/popup/add', {
        controller: 'popupAddCtrl',
        templateUrl: '/views/admin/popup_add.html'
    })
    .when('/popup/modify/:popupId', {
        controller: 'popupModifyCtrl',
        templateUrl: '/views/admin/popup_modify.html'
    })
    .when('/user', {
        controller: 'UserCtrl',
        templateUrl: '/views/admin/user_registry.html'
    })
  	.otherwise({
    	redirectTo: '/'
  	})
});