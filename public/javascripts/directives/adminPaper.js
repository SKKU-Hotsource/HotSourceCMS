app.directive('adminPaper', function() {
  return {
    restrict: 'E',
    scope: {
      paperList: '='
    },
    templateUrl: 'javascripts/directives/adminPaper.html',
    replace: false
  };
});