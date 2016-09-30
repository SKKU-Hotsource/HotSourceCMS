app.directive('mainPaper', function() {
  return {
    restrict: 'E',
    scope: {
      paperList: '='
    },
    templateUrl: 'javascripts/directives/mainPaper.html',
    replace: false
  };
});