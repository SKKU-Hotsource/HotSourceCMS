app.directive('mainSlide', function() {
  return {
    restrict: 'E',
    scope: {
      slidePosts: '=',
      slides: '='
    },
    templateUrl: 'javascripts/directives/mainSlide.html',
    replace: false
  };
});