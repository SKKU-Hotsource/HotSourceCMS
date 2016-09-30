app.directive('mainNav', function() {
  return {
    restrict: 'E',
    scope: {
      navList: '=' 
    },
    templateUrl: 'javascripts/directives/mainNav.html',
    replace: true
  };
});